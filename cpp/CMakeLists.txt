cmake_minimum_required(VERSION 3.17)
project(JsUtil)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_LIST_DIR}")
find_package(JsUtil 9.0 REQUIRED)

if (${BUILD_JSUTIL_TEST})
    # not strictly required to supply env, but do so to test LINK_OPTIONS
    jsu_create_executable(asan-test-module
            SOURCE_FILES dummy.cpp
            LINK_LIBRARIES JsUtil
            COMPILE_OPTIONS "-O0 -g3 -fsanitize=address -fsanitize=undefined"
            LINK_OPTIONS "-sALLOW_MEMORY_GROWTH -sENVIRONMENT=node -fsanitize=address -fsanitize=undefined -sEXIT_RUNTIME=1")

    # todo jack: try removing -sENVIRONMENT=node
    # use default link options, should work either way
    jsu_create_executable(safe-heap-test-module
            SOURCE_FILES dummy.cpp
            LINK_LIBRARIES JsUtil
#            COMPILE_OPTIONS "-O0 -g3"
#            LINK_OPTIONS "-sALLOW_MEMORY_GROWTH -sENVIRONMENT=node -sINITIAL_MEMORY=8192kb"
            COMPILE_OPTIONS "-O0 -g3 -fsanitize=address -fsanitize=undefined"
            LINK_OPTIONS "-sINITIAL_MEMORY=8192kb -sALLOW_MEMORY_GROWTH -sENVIRONMENT=node -fsanitize=address -fsanitize=undefined -sEXIT_RUNTIME=1"
    )

    include(CTest)
    find_package(GoogleTest REQUIRED)
    # c++ tests
    jsu_create_test(TestVector
            SOURCE_FILES test/TestVector.cpp
            LINK_LIBRARIES JsUtil GTest::gtest_main)
endif ()