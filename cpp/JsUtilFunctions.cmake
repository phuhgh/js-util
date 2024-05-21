cmake_policy(SET CMP0069 NEW)
set(CMAKE_POLICY_DEFAULT_CMP0069 NEW)

function(get_common_path_prefix paths result)
    set(prefix_list "${paths}")
    list(GET prefix_list 0 _prefix)

    foreach (path IN LISTS prefix_list)
        while (NOT "${path}" MATCHES "^${_prefix}")
            get_filename_component(_prefix "${_prefix}" DIRECTORY)
        endwhile ()
    endforeach ()

    set(${result} ${_prefix} PARENT_SCOPE)
endfunction()

macro(jsu_log_message_wrap message)
    string(PREPEND message "\n==========================================================\n")
    string(APPEND message "\n==========================================================\n")
endmacro()

function(jsu_log_status message)
    jsu_log_message_wrap(message)
    message(STATUS "${message}")
endfunction()

function(validatePaths errorContext paths onlyDirectoriesAllowed)
    foreach (_path ${paths})
        if (NOT EXISTS ${_path})
            message(SEND_ERROR "${errorContext} - failed to resolve path: ${_path}")
        endif ()
        if (onlyDirectoriesAllowed AND NOT IS_DIRECTORY ${_path})
            message(SEND_ERROR "${errorContext} - expected directory, got file: ${_path}")
        endif ()
    endforeach ()
endfunction()

function(jsu_initializeModule moduleName)
    if (NOT "${moduleName}" IN_LIST RC_JS_TARGET_LIST)
        file(READ "${CMAKE_CURRENT_LIST_DIR}/exported-names.txt" LOCAL_NAMES)

        if (NOT LOCAL_NAMES)
            # probably the IDE running before the names were generated
            message(SEND_ERROR "No names were found, run the build script.")
        endif ()

        set(RC_JS_EXPORTED_NAMES "${RC_JS_EXPORTED_NAMES}" "${LOCAL_NAMES}" CACHE INTERNAL "")
        set(RC_JS_TARGET_LIST "${RC_JS_TARGET_LIST}" "${moduleName}" CACHE INTERNAL "")
    endif ()
endfunction()

# sets some "sensible" compile / link flags for release and debug - YMMV
# note: call this before creating any targets
# note: enables LTO for all targets in release...
# mode {ASAN/SAFE_HEAP} - optional
macro(jsu_set_build_flags mode)
    set(JSU_CXX_FLAGS "")
    set(JSU_EXE_LINKER_FLAGS "")
    set(JSU_STATIC_LINKER_FLAGS "")

    if (${CMAKE_BUILD_TYPE} STREQUAL "Debug")
        list(APPEND JSU_CXX_FLAGS -O0 -g3)
        # suppress warnings related to limited opts because of DWARF
        list(APPEND JSU_EXE_LINKER_FLAGS -O0 -g3 -sASSERTIONS=2 -Wno-limited-postlink-optimizations)
        list(APPEND JSU_STATIC_LINKER_FLAGS -O0 -g3 -sASSERTIONS=2 -Wno-limited-postlink-optimizations)
    elseif (${CMAKE_BUILD_TYPE} STREQUAL "Release")
        set(CMAKE_INTERPROCEDURAL_OPTIMIZATION TRUE)

        list(APPEND JSU_CXX_FLAGS -O3 -msimd128)
        list(APPEND JSU_EXE_LINKER_FLAGS -O3 -msimd128)
        list(APPEND JSU_STATIC_LINKER_FLAGS -O3 -msimd128)
    endif ()

    if (NOT mode)
        # it's an error to try to use mode
    elseif (${mode} STREQUAL "ASAN")
        message(STATUS "Applying address sanitized build flags")
        list(APPEND JSU_CXX_FLAGS -fsanitize=address -fsanitize=undefined)
        list(APPEND JSU_EXE_LINKER_FLAGS -fsanitize=address -fsanitize=undefined)
        list(APPEND JSU_STATIC_LINKER_FLAGS -fsanitize=address -fsanitize=undefined)
    elseif (${mode} STREQUAL "SAFE_HEAP")
        message(STATUS "Applying safe heap build flags")
        list(APPEND JSU_EXE_LINKER_FLAGS "-sSAFE_HEAP")
        list(APPEND JSU_STATIC_LINKER_FLAGS "-sSAFE_HEAP")
    else (${mode} STREQUAL "")
        message(SEND_ERROR "Unknown mode option '${mode}'. The options are: ASAN, SAFE_HEAP.")
    endif ()

    set_property(GLOBAL PROPERTY JSU_CXX_FLAGS "${JSU_CXX_FLAGS}")
    set_property(GLOBAL PROPERTY JSU_STATIC_LINKER_FLAGS "${JSU_STATIC_LINKER_FLAGS}")
    set_property(GLOBAL PROPERTY JSU_EXE_LINKER_FLAGS "${JSU_EXE_LINKER_FLAGS}")
    UNSET(JSU_CXX_FLAGS)
    UNSET(JSU_STATIC_LINKER_FLAGS)
    UNSET(JSU_EXE_LINKER_FLAGS)
endmacro()

macro(internal_jsu_get_common_link_flags writeTo hasMain noBindings)
    LIST(LENGTH RC_JS_EXPORTED_NAMES __length)

    if (__length EQUAL 0)
        message(SEND_ERROR "Expected RC_JS_EXPORTED_NAMES to be populated, did you call jsu_initializeModule?")
    endif ()
    unset(__length)

    string(SUBSTRING "${RC_JS_EXPORTED_NAMES}" 1 -1 __EXPORTED_NAMES)
    if (${hasMain})
        list(APPEND __EXPORTED_NAMES _main)
    endif ()
    string(REPLACE ";" "','" __EXPORTED_NAMES "${__EXPORTED_NAMES}")

    string(CONCAT __DEFAULT_LINK_FLAGS
            "-sNODEJS_CATCH_REJECTION=0 "
            "-sNODEJS_CATCH_EXIT=0 "
            "-sIMPORTED_MEMORY "
            "-sLLD_REPORT_UNDEFINED ")
    if (${hasMain})
        string(PREPEND __DEFAULT_LINK_FLAGS "-sINVOKE_RUN=1 ")
    else ()
        string(PREPEND __DEFAULT_LINK_FLAGS "--no-entry -sMODULARIZE=1 ")
    endif ()

    if(NOT ${noBindings})
        string(APPEND __DEFAULT_LINK_FLAGS "-sEXPORTED_FUNCTIONS=['${__EXPORTED_NAMES}']")
    endif ()

    string(APPEND ${writeTo} "${__DEFAULT_LINK_FLAGS}")

    unset(__EXPORTED_NAMES)
    unset(__DEFAULT_LINK_FLAGS)
endmacro()

macro(jsu_resolve_files writeTo sourceVar)
    foreach (_source ${sourceVar})
        if (IS_ABSOLUTE ${_source})
            list(APPEND _sources ${_source})
        else ()
            set(_globSources)
            file(GLOB _files ${CMAKE_CURRENT_LIST_DIR}/${_source})

            foreach (_file ${_files})
                list(APPEND _sources ${_file})
                list(APPEND _globSources ${_file})
            endforeach ()

            if (NOT _globSources)
                message(SEND_ERROR "Glob ${CMAKE_CURRENT_LIST_DIR}/${_source} didn't match anything")
            endif ()

            unset(_globSources)
        endif ()
    endforeach ()

    set(${writeTo} ${_sources})
endmacro()

# creates a static library
function(jsu_create_libray targetName)
    set(_multiParamArgs
            SOURCE_FILES
            COMPILE_OPTIONS
            LINK_OPTIONS
            PUBLIC_INCLUDE_DIRS PRIVATE_INCLUDE_DIRS
            PUBLIC_LINK_LIBRARIES PRIVATE_LINK_LIBRARIES INTERFACE_LINK_LIBRARIES
            PUBLIC_COMPILE_FEATURES PRIVATE_COMPILE_FEATURES)
    cmake_parse_arguments(ARG "" "" "${_multiParamArgs}" "${ARGN}")
    unset(_multiParamArgs)

    if (DEFINED ARG_UNPARSED_ARGUMENTS)
        message(SEND_ERROR "Extra argument found adding \"${targetName}\": ${ARG_UNPARSED_ARGUMENTS}.")
    endif ()

    jsu_resolve_files(_resolvedSourceFiles "${ARG_SOURCE_FILES}")
    validatePaths("${targetName} SOURCE_FILES" "${_resolvedSourceFiles}" false)
    validatePaths("${targetName} PUBLIC_INCLUDE_DIRS" "${ARG_PUBLIC_INCLUDE_DIRS}" true)
    validatePaths("${targetName} PRIVATE_INCLUDE_DIRS" "${ARG_PRIVATE_INCLUDE_DIRS}" true)

    # it's only possible to statically link
    add_library("${targetName}" STATIC "${_resolvedSourceFiles}")
    get_common_path_prefix("${_resolvedSourceFiles}" commonPrefix)
    string(REPLACE "${commonPrefix}/" "" _resolvedSourceFiles "${_resolvedSourceFiles}")

    string(REPLACE ";" " " _resolvedSourceFiles "${_resolvedSourceFiles}")
    list(APPEND _message "SOURCE_FILES: ${_resolvedSourceFiles}")

    if (ARG_PRIVATE_LINK_LIBRARIES)
        list(REMOVE_DUPLICATES ARG_PRIVATE_LINK_LIBRARIES)
        target_link_libraries("${targetName}" PRIVATE "${ARG_PRIVATE_LINK_LIBRARIES}")

        string(REPLACE ";" " " ARG_PRIVATE_LINK_LIBRARIES "${ARG_PRIVATE_LINK_LIBRARIES}")
        list(APPEND _message "PRIVATE_LINK_LIBRARIES: ${ARG_PRIVATE_LINK_LIBRARIES}")
    endif ()

    if (ARG_INTERFACE_LINK_LIBRARIES)
        list(REMOVE_DUPLICATES ARG_INTERFACE_LINK_LIBRARIES)
        target_link_libraries("${targetName}" INTERFACE "${ARG_INTERFACE_LINK_LIBRARIES}")

        string(REPLACE ";" " " ARG_INTERFACE_LINK_LIBRARIES "${ARG_INTERFACE_LINK_LIBRARIES}")
        list(APPEND _message "INTERFACE_LINK_LIBRARIES: ${ARG_INTERFACE_LINK_LIBRARIES}")
    endif ()

    if (ARG_PUBLIC_LINK_LIBRARIES)
        list(REMOVE_DUPLICATES ARG_PUBLIC_LINK_LIBRARIES)
        target_link_libraries("${targetName}" PUBLIC "${ARG_PUBLIC_LINK_LIBRARIES}")

        string(REPLACE ";" " " ARG_PUBLIC_LINK_LIBRARIES "${ARG_PUBLIC_LINK_LIBRARIES}")
        list(APPEND _message "PUBLIC_LINK_LIBRARIES: ${ARG_PUBLIC_LINK_LIBRARIES}")
    endif ()

    if (ARG_PUBLIC_INCLUDE_DIRS)
        target_include_directories("${targetName}" PUBLIC "${ARG_PUBLIC_INCLUDE_DIRS}")
        string(REPLACE ";" " " ARG_PUBLIC_INCLUDE_DIRS "${ARG_PUBLIC_INCLUDE_DIRS}")
        list(APPEND _message "PUBLIC_INCLUDE_DIRS: ${ARG_PUBLIC_INCLUDE_DIRS}")
    endif ()

    if (ARG_PRIVATE_INCLUDE_DIRS)
        target_include_directories("${targetName}" PRIVATE "${ARG_PRIVATE_INCLUDE_DIRS}")
        string(REPLACE ";" " " ARG_PRIVATE_INCLUDE_DIRS "${ARG_PRIVATE_INCLUDE_DIRS}")
        list(APPEND _message "PRIVATE_INCLUDE_DIRS: ${ARG_PRIVATE_INCLUDE_DIRS}")
    endif ()

    internal_jsu_set_compile_options()
    internal_jsu_set_link_options(false false true)

    if (ARG_PUBLIC_COMPILE_FEATURES)
        set(_publicCompileFeatures ${ARG_PUBLIC_COMPILE_FEATURES})
        separate_arguments(_publicCompileFeatures)
        target_compile_features("${targetName}" PRIVATE "${_publicCompileFeatures}")

        string(REPLACE ";" " " _publicCompileFeatures "${_publicCompileFeatures}")
        list(APPEND _message "PUBLIC_COMPILE_FEATURES: ${_publicCompileFeatures}")
    endif ()

    if (ARG_PRIVATE_COMPILE_FEATURES)
        set(_privateCompileFeatures ${ARG_PRIVATE_COMPILE_FEATURES})
        separate_arguments(_privateCompileFeatures)
        target_compile_features("${targetName}" PRIVATE "${_privateCompileFeatures}")

        string(REPLACE ";" " " _privateCompileFeatures "${_privateCompileFeatures}")
        list(APPEND _message "PRIVATE_COMPILE_FEATURES: ${_privateCompileFeatures}")
    endif ()

    string(REPLACE ";" "\n" _message "${_message}")
    string(PREPEND _message "Creating static library: \"${targetName}\"\n")
    jsu_log_status(${_message})
endfunction(jsu_create_libray)

macro(internal_jsu_set_compile_options)
    set(CompileFlags "")
    if (ARG_COMPILE_OPTIONS)
        set(_compileOptions ${ARG_COMPILE_OPTIONS})
        separate_arguments(_compileOptions)
        set(CompileFlags ${_compileOptions})
    endif ()

    get_property(JSU_CXX_FLAGS GLOBAL PROPERTY JSU_CXX_FLAGS)
    if (JSU_CXX_FLAGS)
        list(PREPEND CompileFlags "${JSU_CXX_FLAGS}")
    endif ()
    unset(JSU_CXX_FLAGS)

    target_compile_options("${targetName}" PRIVATE "${CompileFlags}")

    if (CompileFlags)
        string(REPLACE ";" " " CompileFlags "${CompileFlags}")
        list(APPEND _message "COMPILE_OPTIONS: ${CompileFlags}")
    endif ()
    unset(CompileFlags)
endmacro()

macro(internal_jsu_set_link_options isExe hasMain noBindings)
    set(LinkFlags "")
    if (${isExe})
        # prepend the mandatory flags (required symbols etc)
        internal_jsu_get_common_link_flags(LinkFlags ${hasMain} ${noBindings})
    endif ()

    if (ARG_LINK_OPTIONS)
        list(APPEND LinkFlags " ${ARG_LINK_OPTIONS}")
    endif ()

    get_property(JSU_STATIC_LINKER_FLAGS GLOBAL PROPERTY JSU_STATIC_LINKER_FLAGS)
    get_property(JSU_EXE_LINKER_FLAGS GLOBAL PROPERTY JSU_EXE_LINKER_FLAGS)
    if (${isExe} AND JSU_EXE_LINKER_FLAGS)
        # explicitly merge flags so that they are output in the message
        list(PREPEND LinkFlags "${JSU_EXE_LINKER_FLAGS}")
    elseif (JSU_STATIC_LINKER_FLAGS)
        list(PREPEND LinkFlags "${JSU_STATIC_LINKER_FLAGS}")
    endif ()
    unset(JSU_STATIC_LINKER_FLAGS)
    unset(JSU_EXE_LINKER_FLAGS)

    string(REPLACE ";" " " LinkFlags "${LinkFlags}")
    set_target_properties("${targetName}" PROPERTIES LINK_FLAGS "${LinkFlags}")

    if (LinkFlags)
        string(REPLACE ";" " " LinkFlags "${LinkFlags}")
        list(APPEND _message "LINK_FLAGS: ${LinkFlags}")
    endif ()
    unset(LinkFlags)
endmacro()

# creates an executable
function(jsu_create_executable targetName)
    set(_multiParamArgs SOURCE_FILES COMPILE_OPTIONS INCLUDE_DIRS LINK_LIBRARIES LINK_OPTIONS)
    cmake_parse_arguments(ARG "HAS_MAIN;NO_BINDINGS" "" "${_multiParamArgs}" "${ARGN}")
    unset(_multiParamArgs)

    if (DEFINED ARG_UNPARSED_ARGUMENTS)
        message(SEND_ERROR "Extra argument found adding \"${targetName}\": ${ARG_UNPARSED_ARGUMENTS}.")
    endif ()

    jsu_resolve_files(_resolvedSourceFiles "${ARG_SOURCE_FILES}")
    validatePaths("${targetName} SOURCE_FILES" "${_resolvedSourceFiles}" false)
    validatePaths("${targetName} INCLUDE_DIRS" "${ARG_INCLUDE_DIRS}" true)

    add_executable("${targetName}" "${_resolvedSourceFiles}")
    set(_message "")

    get_common_path_prefix("${_resolvedSourceFiles}" commonPrefix)
    string(REPLACE "${commonPrefix}/" "" _resolvedSourceFiles "${_resolvedSourceFiles}")

    string(REPLACE ";" " " _resolvedSourceFiles "${_resolvedSourceFiles}")
    list(APPEND _message "SOURCE_FILES: ${_resolvedSourceFiles}")

    if (ARG_INCLUDE_DIRS)
        target_include_directories("${targetName}" PUBLIC "${ARG_INCLUDE_DIRS}")

        string(REPLACE ";" " " ARG_INCLUDE_DIRS "${ARG_INCLUDE_DIRS}")
        list(APPEND _message "INCLUDE_DIRS: ${ARG_INCLUDE_DIRS}")
    endif ()

    if (ARG_LINK_LIBRARIES)
        list(REMOVE_DUPLICATES ARG_LINK_LIBRARIES)
        target_link_libraries("${targetName}" PUBLIC "${ARG_LINK_LIBRARIES}")

        string(REPLACE ";" " " ARG_LINK_LIBRARIES "${ARG_LINK_LIBRARIES}")
        list(APPEND _message "LINK_LIBRARIES: ${ARG_LINK_LIBRARIES}")
    endif ()

    if (NOT ARG_HAS_MAIN)
        # ensure there is always a boolean, makes it easier to consume...
        set(ARG_HAS_MAIN false)
    endif ()
        if (NOT ARG_NO_BINDINGS)
        # ensure there is always a boolean, makes it easier to consume...
        set(ARG_NO_BINDINGS false)
    endif ()


    internal_jsu_set_compile_options()
    internal_jsu_set_link_options(true ${ARG_HAS_MAIN} ${ARG_NO_BINDINGS})

    string(REPLACE ";" "\n" _message "${_message}")
    string(PREPEND _message "Creating executable: \"${targetName}\"\n")
    jsu_log_status(${_message})
endfunction(jsu_create_executable)

# creates a ctest - built & linked with ASAN
function(jsu_create_test targetName)
    set(_multiParamArgs SOURCE_FILES COMPILE_OPTIONS INCLUDE_DIRS LINK_LIBRARIES LINK_OPTIONS)
    cmake_parse_arguments(ARG "" "" "${_multiParamArgs}" "${ARGN}")
    unset(_multiParamArgs)

    jsu_create_executable("${targetName}"
            SOURCE_FILES "${ARG_SOURCE_FILES}"
            COMPILE_OPTIONS "${ARG_COMPILE_OPTIONS}"
            INCLUDE_DIRS "${ARG_INCLUDE_DIRS}"
            LINK_LIBRARIES "${ARG_LINK_LIBRARIES}"
            LINK_OPTIONS ${ARG_LINK_OPTIONS} -sENVIRONMENT=node -sEXIT_RUNTIME=1
            HAS_MAIN
            NO_BINDINGS)

    add_test(NAME "${targetName}"
            COMMAND node "${CMAKE_CURRENT_BINARY_DIR}/${targetName}.js")
endfunction(jsu_create_test)

# todo jack: test if this can handle the case where there is no node_modules dir
function(jsu_find_node_module PACKAGE_NAME PACKAGE_DIR ROOT_DIR RESULT_LIST)
    set(SEARCH_DIRS)
    get_filename_component(PACKAGE_DIR_REALPATH ${PACKAGE_DIR} REALPATH)
    get_filename_component(ROOT_DIR_REALPATH ${ROOT_DIR} REALPATH)

    while (NOT "${PACKAGE_DIR_REALPATH}" STREQUAL "${ROOT_DIR_REALPATH}")
        list(APPEND SEARCH_DIRS "${PACKAGE_DIR_REALPATH}/node_modules/${PACKAGE_NAME}")
        get_filename_component(PACKAGE_DIR_REALPATH ${PACKAGE_DIR_REALPATH}/.. REALPATH)
    endwhile ()

    # hacky way of avoid double slash for the last one
    if (NOT ROOT_DIR_REALPATH MATCHES "/$")
        string(APPEND ROOT_DIR_REALPATH "/")
    endif ()
    list(APPEND SEARCH_DIRS "${ROOT_DIR_REALPATH}node_modules/${PACKAGE_NAME}")

    set(${RESULT_LIST} ${SEARCH_DIRS} PARENT_SCOPE)
endfunction()

