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
        file(READ "${CMAKE_SOURCE_DIR}/exported-names.txt" LOCAL_NAMES)
        set(RC_JS_EXPORTED_NAMES "${RC_JS_EXPORTED_NAMES}" "${LOCAL_NAMES}" CACHE INTERNAL "")
        set(RC_JS_TARGET_LIST "${RC_JS_TARGET_LIST}" "${moduleName}" CACHE INTERNAL "")
    endif ()
endfunction()

macro(jsu_get_common_test_link_flags writeTo)
    LIST(LENGTH RC_JS_EXPORTED_NAMES __length)

    if (__length EQUAL 0)
        message(SEND_ERROR "Expected RC_JS_EXPORTED_NAMES to be populated, did you call jsu_initializeModule?")
    endif ()
    unset(__length)

    string(SUBSTRING "${RC_JS_EXPORTED_NAMES}" 1 -1 __EXPORTED_NAMES)
    string(REPLACE ";" "','" __EXPORTED_NAMES "${__EXPORTED_NAMES}")

    # -s -Wno-limited-postlink-optimizations
    set(${writeTo} "-O0 -g3  -s ALLOW_MEMORY_GROWTH -s ASSERTIONS=2 -s NODEJS_CATCH_REJECTION=0 -s NODEJS_CATCH_EXIT=0 -s IMPORTED_MEMORY -s MODULARIZE=1 -s LLD_REPORT_UNDEFINED --no-entry -s -Wno-limited-postlink-optimizations -s EXPORTED_FUNCTIONS=['${__EXPORTED_NAMES}']")
    unset(__EXPORTED_NAMES)
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

function(jsu_create_libray targetName)
    set(_multiParamArgs
            SOURCE_FILES
            COMPILE_OPTIONS
            PUBLIC_INCLUDE_DIRS PRIVATE_INCLUDE_DIRS
            PUBLIC_LINK_LIBRARIES PRIVATE_LINK_LIBRARIES INTERFACE_LINK_LIBRARIES)
    cmake_parse_arguments(ARG "" "" "${_multiParamArgs}" "${ARGN}")
    unset(_multiParamArgs)

    if (DEFINED ARG_UNPARSED_ARGUMENTS)
        message(SEND_ERROR "Extra argument found adding \"${targetName}\": ${ARG_UNPARSED_ARGUMENTS}.")
    endif ()

    jsu_resolve_files(_resolvedSourceFiles ${ARG_SOURCE_FILES})
    validatePaths("${targetName} SOURCE_FILES" "${_resolvedSourceFiles}" false)
    validatePaths("${targetName} PUBLIC_INCLUDE_DIRS" "${ARG_PUBLIC_INCLUDE_DIRS}" true)
    validatePaths("${targetName} PRIVATE_INCLUDE_DIRS" "${ARG_PRIVATE_INCLUDE_DIRS}" true)

    # it's only possible to statically link
    add_library("${targetName}" STATIC "${_resolvedSourceFiles}")
    set(_message "")

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
    endif ()

    if (ARG_PRIVATE_INCLUDE_DIRS)
        target_include_directories("${targetName}" PRIVATE "${ARG_PRIVATE_INCLUDE_DIRS}")
    endif ()

    if (ARG_COMPILE_OPTIONS)
        set(_compileOptions ${ARG_COMPILE_OPTIONS})
        separate_arguments(_compileOptions)
        target_compile_options("${targetName}" PRIVATE "${_compileOptions}")

        string(REPLACE ";" " " _compileOptions "${_compileOptions}")
        list(APPEND _message "COMPILE_OPTIONS: ${_compileOptions}")
    endif ()

    string(REPLACE ";" "\n" _message "${_message}")
    string(PREPEND _message "Creating static library: \"${targetName}\"\n")
    jsu_log_status(${_message})
endfunction(jsu_create_libray)

function(jsu_create_executable targetName)
    set(_multiParamArgs SOURCE_FILES COMPILE_OPTIONS INCLUDE_DIRS LINK_LIBRARIES LINK_OPTIONS)
    cmake_parse_arguments(ARG "" "" "${_multiParamArgs}" "${ARGN}")
    unset(_multiParamArgs)

    if (DEFINED ARG_UNPARSED_ARGUMENTS)
        message(SEND_ERROR "Extra argument found adding \"${targetName}\": ${ARG_UNPARSED_ARGUMENTS}.")
    endif ()

    jsu_resolve_files(_resolvedSourceFiles ${ARG_SOURCE_FILES})
    validatePaths("${targetName} SOURCE_FILES" "${_resolvedSourceFiles}" false)
    validatePaths("${targetName} INCLUDE_DIRS" "${ARG_INCLUDE_DIRS}" true)

    add_executable("${targetName}" "${_resolvedSourceFiles}")
    set(_message "")

    if (ARG_INCLUDE_DIRS)
        target_include_directories("${targetName}" PUBLIC "${ARG_INCLUDE_DIRS}")
    endif ()

    if (ARG_LINK_LIBRARIES)
        list(REMOVE_DUPLICATES ARG_LINK_LIBRARIES)
        target_link_libraries("${targetName}" PUBLIC "${ARG_LINK_LIBRARIES}")

        string(REPLACE ";" " " ARG_LINK_LIBRARIES "${ARG_LINK_LIBRARIES}")
        list(APPEND _message "LINK_LIBRARIES: ${ARG_LINK_LIBRARIES}")
    endif ()

    if (ARG_COMPILE_OPTIONS)
        set(_compileOptions ${ARG_COMPILE_OPTIONS})
        separate_arguments(_compileOptions)
        target_compile_options("${targetName}" PRIVATE "${_compileOptions}")
        list(APPEND _message "COMPILE_FLAGS: ${ARG_COMPILE_OPTIONS}")
    endif ()

    if (ARG_LINK_OPTIONS)
        set_target_properties("${targetName}" PROPERTIES LINK_FLAGS "${ARG_LINK_OPTIONS}")
        list(APPEND _message "LINK_FLAGS: ${ARG_LINK_OPTIONS}")
    endif ()

    string(REPLACE ";" "\n" _message "${_message}")
    string(PREPEND _message "Creating executable: \"${targetName}\"\n")
    jsu_log_status(${_message})
endfunction(jsu_create_executable)

function(jsu_create_asan_executable targetName)
    set(_multiParamArgs SOURCE_FILES COMPILE_OPTIONS INCLUDE_DIRS LINK_LIBRARIES LINK_OPTIONS)
    cmake_parse_arguments(ARG "" "" "${_multiParamArgs}" "${ARGN}")
    unset(_multiParamArgs)

    if (DEFINED ARG_UNPARSED_ARGUMENTS)
        message(SEND_ERROR "Extra argument found adding \"${targetName}\": ${ARG_UNPARSED_ARGUMENTS}.")
    endif ()

    # this needs to be a string
    set(CommonTestLinkFlags "")
    jsu_get_common_test_link_flags(CommonTestLinkFlags)
    STRING(APPEND CommonTestLinkFlags " -fsanitize=address -fsanitize=undefined -s EXIT_RUNTIME=1")

    jsu_create_executable("${targetName}"
            SOURCE_FILES "${ARG_SOURCE_FILES}"
            INCLUDE_DIRS "${ARG_INCLUDE_DIRS}"
            LINK_LIBRARIES "${ARG_LINK_LIBRARIES}"
            COMPILE_OPTIONS "-O0 -fsanitize=address -fsanitize=undefined"
            LINK_OPTIONS "${CommonTestLinkFlags}"
            )
endfunction()

function(jsu_create_safe_heap_executable targetName)
    set(_multiParamArgs SOURCE_FILES COMPILE_OPTIONS INCLUDE_DIRS LINK_LIBRARIES LINK_OPTIONS)
    cmake_parse_arguments(ARG "" "" "${_multiParamArgs}" "${ARGN}")
    unset(_multiParamArgs)

    if (DEFINED ARG_UNPARSED_ARGUMENTS)
        message(SEND_ERROR "Extra argument found adding \"${targetName}\": ${ARG_UNPARSED_ARGUMENTS}.")
    endif ()

    # this needs to be a string
    set(CommonTestLinkFlags "")
    jsu_get_common_test_link_flags(CommonTestLinkFlags)
    STRING(APPEND CommonTestLinkFlags " -s INITIAL_MEMORY=8192kb -s SAFE_HEAP")

    jsu_create_executable("${targetName}"
            SOURCE_FILES "${ARG_SOURCE_FILES}"
            INCLUDE_DIRS "${ARG_INCLUDE_DIRS}"
            LINK_LIBRARIES "${ARG_LINK_LIBRARIES}"
            COMPILE_OPTIONS "-O0 -g3"
            LINK_OPTIONS "${CommonTestLinkFlags}"
            )
endfunction()