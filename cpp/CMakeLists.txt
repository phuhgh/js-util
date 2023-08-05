cmake_minimum_required(VERSION 3.17)
project(JsUtil)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_LIST_DIR}")
find_package(JsUtil 9.0 REQUIRED)

if (${BUILD_JSUTIL_TEST})
    # not strictly required to supply env, but do so to test LINK_OPTIONS
    jsu_create_asan_executable(asan-test-module
            SOURCE_FILES dummy.cpp
            LINK_LIBRARIES JsUtil
            LINK_OPTIONS "-s ENVIRONMENT=node")

    # use default link options, should work either way
    jsu_create_safe_heap_executable(safe-heap-test-module
            SOURCE_FILES dummy.cpp
            LINK_LIBRARIES JsUtil)
endif ()