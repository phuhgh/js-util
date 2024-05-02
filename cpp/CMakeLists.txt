cmake_minimum_required(VERSION 3.17)
project(JsUtil)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_LIST_DIR}")
include(JsUtilFunctions)
jsu_set_build_flags("${JSU_BUILD_MODE}")
find_package(JsUtil 9.0 REQUIRED)

if (${BUILD_JSUTIL_TEST})
    jsu_create_executable(util-test-module
            SOURCE_FILES dummy.cpp
            LINK_LIBRARIES JsUtil
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH -sENVIRONMENT=node -sEXIT_RUNTIME=1)

    include(CTest)
    find_package(GoogleTest REQUIRED)
    # c++ tests
    jsu_create_test(TestVector
            SOURCE_FILES test/TestVector.cpp
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH
            LINK_LIBRARIES JsUtil GTest::gtest_main)
endif ()