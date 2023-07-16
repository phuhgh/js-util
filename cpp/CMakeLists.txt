project(JsUtilTest)

find_package(JsUtil 9.0 REQUIRED)

if (${BUILD_JSUTIL_TEST})
    jsu_create_asan_executable(asan-test-module
            SOURCE_FILES dummy.cpp
            LINK_LIBRARIES JsUtil)

    jsu_create_safe_heap_executable(safe-heap-test-module
            SOURCE_FILES dummy.cpp
            LINK_LIBRARIES JsUtil)
endif ()