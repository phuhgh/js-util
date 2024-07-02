cmake_minimum_required(VERSION 3.17)
project(JsUtil)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

message(STATUS "EMSDK_NODE: $ENV{EMSDK_NODE}")
message(STATUS "EMSDK_PYTHON: $ENV{EMSDK_PYTHON}")
message(STATUS "JAVA_HOME: $ENV{JAVA_HOME}")
message(STATUS "EMSDK_ROOT: $ENV{EMSDK_ROOT}")

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
    # javascript test module
    jsu_create_executable(util-test-module
            SOURCE_FILES test-util/JsTestModuleBindings.cpp
            LINK_LIBRARIES JsUtil
            COMPILE_OPTIONS -pthread
            LINK_OPTIONS -sEXPORT_ES6 -sALLOW_MEMORY_GROWTH -sENVIRONMENT=node,web
            -sEXIT_RUNTIME=1 -sINITIAL_MEMORY=8mb -pthread -lembind -sPTHREAD_POOL_SIZE_STRICT=0)

    include(CTest)
    find_package(GoogleTest REQUIRED)
    # c++ tests
    jsu_create_test(TestVector
            SOURCE_FILES test/TestVector.cpp
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
    jsu_create_test(TestResizableArray
            SOURCE_FILES test/TestResizableArray.cpp
            LINK_OPTIONS -sINITIAL_MEMORY=16mb
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
    jsu_create_test(TestDebug
            SOURCE_FILES test/TestDebug.cpp
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
    jsu_create_test(TestCircularBuffer
            SOURCE_FILES test/TestCircularBuffer.cpp
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
    jsu_create_test(TestCircularFifoStack
            SOURCE_FILES test/TestCircularFifoStack.cpp
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
    jsu_create_test(TestWorkerLoop
            SOURCE_FILES test/TestWorkerLoop.cpp
            INCLUDE_DIRS "${CMAKE_CURRENT_LIST_DIR}/test-util"
            COMPILE_OPTIONS -pthread
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH -pthread
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
    jsu_create_test(TestWorkerPool
            SOURCE_FILES test/TestWorkerPool.cpp
            INCLUDE_DIRS "${CMAKE_CURRENT_LIST_DIR}/test-util"
            COMPILE_OPTIONS -pthread
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH -pthread
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
endif ()