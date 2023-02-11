project(JsUtilImpl)

# todo jack: good for util
message(STATUS "compiler ${CMAKE_CXX_COMPILER_ID} ${CMAKE_CXX_COMPILER_VERSION}")

jsu_initializeModule(JsUtil)

jsu_create_libray(JsUtil
        SOURCE_FILES src/*.cpp
        PUBLIC_INCLUDE_DIRS "${PROJECT_SOURCE_DIR}/include"
        COMPILE_OPTIONS $<$<CONFIG:Debug>:-Werror -Wall -Wextra -pedantic>
        )

if (${BUILD_JSUTIL_TEST})
    jsu_create_asan_executable(asan-test-module
            SOURCE_FILES src/*.cpp
            INCLUDE_DIRS "${PROJECT_SOURCE_DIR}/include")

    jsu_create_safe_heap_executable(safe-heap-test-module
            SOURCE_FILES src/*.cpp
            INCLUDE_DIRS "${PROJECT_SOURCE_DIR}/include")
endif ()