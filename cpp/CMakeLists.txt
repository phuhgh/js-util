project(JsUtilImpl)

jsu_initializeModule(JsUtil)

if (NOT "JsUtil" IN_LIST RC_JS_TARGET_LIST)
    jsu_create_libray(JsUtil
            SOURCE_FILES src/*.cpp
            PUBLIC_INCLUDE_DIRS "${PROJECT_SOURCE_DIR}/include"
            # todo jack: likely to break if used with different version of compiler, ideally just local builds for CI
            COMPILE_OPTIONS "Werror -Wall -Wextra -pedantic"
            )
endif ()

if (${BUILD_JSUTIL_TEST})
    jsu_create_asan_executable(asan-test-module
            SOURCE_FILES src/*.cpp
            INCLUDE_DIRS "${PROJECT_SOURCE_DIR}/include")

    jsu_create_safe_heap_executable(safe-heap-test-module
            SOURCE_FILES src/*.cpp
            INCLUDE_DIRS "${PROJECT_SOURCE_DIR}/include")
endif ()