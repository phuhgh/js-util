cmake_minimum_required(VERSION 3.17)
project(JsUtil)

set(CMAKE_CXX_STANDARD 20)

if (${BUILD_JSUTIL_TEST})
    # nuke the caches
    set(RC_JS_EXPORTED_NAMES "" CACHE INTERNAL "")
    set(RC_JS_BUILD_LIST "" CACHE INTERNAL "")
endif ()

if (NOT "JsUtil" IN_LIST RC_JS_BUILD_LIST)
    file(READ exported-names.txt LOCAL_NAMES)
    set(RC_JS_EXPORTED_NAMES "${RC_JS_EXPORTED_NAMES}" "${LOCAL_NAMES}" CACHE INTERNAL "")
    set(RC_JS_BUILD_LIST "${RC_JS_BUILD_LIST}" "JsUtil" CACHE INTERNAL "")
endif()

add_subdirectory(external)

set(SOURCE_FILES
        src/SharedArray.cpp
        src/JsUtil.cpp
        src/Debug.cpp
        )

if (${BUILD_JSUTIL_TEST})
    string(SUBSTRING "${RC_JS_EXPORTED_NAMES}" 1 -1 EXPORTED_NAMES)
    string(REPLACE ";"  "','" EXPORTED_NAMES "${EXPORTED_NAMES}")
    set(CommonLinkFlags "-O0 -g -s EXPORTED_FUNCTIONS=['${EXPORTED_NAMES}'] -s ALLOW_MEMORY_GROWTH -s ASSERTIONS=2 -s NODEJS_CATCH_REJECTION=0 -s NODEJS_CATCH_EXIT=0 -s IMPORTED_MEMORY -s MODULARIZE=1 -s LLD_REPORT_UNDEFINED --no-entry")
    set(CommonCompileFlags "-O0 -g")

    add_executable(asan-test-module "${SOURCE_FILES}")
    set_target_properties(asan-test-module PROPERTIES
            LINK_FLAGS "${CommonLinkFlags} -fsanitize=address -fsanitize=undefined -s EXIT_RUNTIME=1"
            COMPILE_FLAGS "${CommonCompileFlags} -fsanitize=address -fsanitize=undefined"
            )
    target_link_libraries(asan-test-module PUBLIC GSL)
    target_include_directories(asan-test-module PUBLIC "$<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>")

    add_executable(safe-heap-test-module "${SOURCE_FILES}")
    set_target_properties(safe-heap-test-module PROPERTIES
            LINK_FLAGS "${CommonLinkFlags} -s INITIAL_MEMORY=8192kb -s SAFE_HEAP -fsanitize=undefined"
            COMPILE_FLAGS "${CommonCompileFlags} -fsanitize=undefined"
            )
    target_link_libraries(safe-heap-test-module PUBLIC GSL)
    target_include_directories(safe-heap-test-module PUBLIC "$<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>")
endif ()

# create library
add_library(JsUtil STATIC "${SOURCE_FILES}")
target_link_libraries(JsUtil PUBLIC GSL)
target_include_directories(JsUtil
        PUBLIC
        "$<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>"
        "$<INSTALL_INTERFACE:include>"
        )
