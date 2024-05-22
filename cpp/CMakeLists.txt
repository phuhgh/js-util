cmake_minimum_required(VERSION 3.17)
project(JsUtil)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if (${BUILD_JSUTIL_TEST})
    # required to compile gtest with pthreads linking / shut up warning
    add_compile_options(-pthread)
    add_link_options(-Wno-pthreads-mem-growth)
endif ()

list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_LIST_DIR}")
include(JsUtilFunctions)
jsu_set_build_flags("${JSU_BUILD_MODE}")
find_package(JsUtil 10.0 REQUIRED)

if (${BUILD_JSUTIL_TEST})
    jsu_create_executable(util-test-module
            SOURCE_FILES dummy.cpp
            LINK_LIBRARIES JsUtil
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH -sENVIRONMENT=node -sEXIT_RUNTIME=1 -sINITIAL_MEMORY=8mb)

    include(CTest)
    find_package(GoogleTest REQUIRED)
    # c++ tests
    jsu_create_test(TestVector
            SOURCE_FILES test/TestVector.cpp
            COMPILE_OPTIONS
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
    jsu_create_test(DebugUtil
            SOURCE_FILES test/TestDebug.cpp
            COMPILE_OPTIONS
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
    # todo jack: workerLoop
    jsu_create_test(TestWorkerTask
            SOURCE_FILES test/TestWorkerLoop.cpp
            INCLUDE_DIRS "${CMAKE_CURRENT_LIST_DIR}/test-util"
            COMPILE_OPTIONS -pthread
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH -pthread
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
endif ()