cmake_minimum_required(VERSION 3.21)
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
    set(pedantic_flags -Werror -Wall -Wextra -pedantic -Wbad-function-cast -Wcast-function-type)

    # javascript test module
    jsu_create_executable(test-module
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
            COMPILE_OPTIONS ${pedantic_flags}
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
    jsu_create_test(TestTuple
            SOURCE_FILES test/TestTuple.cpp
            COMPILE_OPTIONS ${pedantic_flags}
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
    jsu_create_test(TestResizableArray
            SOURCE_FILES test/TestResizableArray.cpp
            COMPILE_OPTIONS ${pedantic_flags}
            LINK_OPTIONS -sINITIAL_MEMORY=16mb
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
    jsu_create_test(TestDebug
            SOURCE_FILES test/TestDebug.cpp
            COMPILE_OPTIONS ${pedantic_flags}
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
    jsu_create_test(TestCircularBuffer
            SOURCE_FILES test/TestCircularBuffer.cpp
            COMPILE_OPTIONS ${pedantic_flags}
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
    jsu_create_test(TestCircularFifoStack
            SOURCE_FILES test/TestCircularFifoStack.cpp
            COMPILE_OPTIONS ${pedantic_flags}
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
    jsu_create_test(TestWorkerLoop
            SOURCE_FILES test/TestWorkerLoop.cpp
            INCLUDE_DIRS "${CMAKE_CURRENT_LIST_DIR}/test-util"
            COMPILE_OPTIONS ${pedantic_flags} -pthread
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH -pthread
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
    jsu_create_test(TestWorkerPool
            SOURCE_FILES test/TestWorkerPool.cpp
            INCLUDE_DIRS "${CMAKE_CURRENT_LIST_DIR}/test-util"
            COMPILE_OPTIONS ${pedantic_flags} -pthread
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH -pthread
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
    jsu_create_test(TestFunctionFactory
            SOURCE_FILES test/TestFunctionFactory.cpp
            INCLUDE_DIRS "${CMAKE_CURRENT_LIST_DIR}/test-util"
            COMPILE_OPTIONS ${pedantic_flags} -pthread
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH -pthread
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
    jsu_create_test(TestHashMap
            SOURCE_FILES test/TestHashMap.cpp
            INCLUDE_DIRS "${CMAKE_CURRENT_LIST_DIR}/test-util"
            COMPILE_OPTIONS ${pedantic_flags} -pthread
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH -pthread
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
    jsu_create_test(TestHashSet
            SOURCE_FILES test/TestHashSet.cpp
            INCLUDE_DIRS "${CMAKE_CURRENT_LIST_DIR}/test-util"
            COMPILE_OPTIONS ${pedantic_flags} -pthread
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH -pthread
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
    jsu_create_test(TestLinkedList
            SOURCE_FILES test/TestLinkedList.cpp
            INCLUDE_DIRS "${CMAKE_CURRENT_LIST_DIR}/test-util"
            COMPILE_OPTIONS ${pedantic_flags} -pthread
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH -pthread
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
    jsu_create_test(TestSet
            SOURCE_FILES test/TestSet.cpp
            INCLUDE_DIRS "${CMAKE_CURRENT_LIST_DIR}/test-util"
            COMPILE_OPTIONS ${pedantic_flags} -pthread
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH -pthread
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
    jsu_create_test(TestInterop
            SOURCE_FILES test/TestInterop.cpp
            INCLUDE_DIRS "${CMAKE_CURRENT_LIST_DIR}/test-util"
            COMPILE_OPTIONS ${pedantic_flags} -pthread
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH -pthread
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
    jsu_create_test(TestLangExt
            SOURCE_FILES test/TestLangExt.cpp
            COMPILE_OPTIONS ${pedantic_flags}
            INCLUDE_DIRS "${CMAKE_CURRENT_LIST_DIR}/test-util"
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
    jsu_create_test(TestSegmentedDataView
            SOURCE_FILES test/TestSegmentedDataView.cpp
            COMPILE_OPTIONS ${pedantic_flags}
            INCLUDE_DIRS "${CMAKE_CURRENT_LIST_DIR}/test-util"
            LINK_OPTIONS -sALLOW_MEMORY_GROWTH
            LINK_LIBRARIES JsUtil GTest::gtest_main GTest::gmock)
endif ()