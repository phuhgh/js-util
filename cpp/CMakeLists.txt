cmake_minimum_required(VERSION 3.17)
project(JsUtil)

set(CMAKE_CXX_STANDARD 20)

add_subdirectory(external)

set(SOURCE_FILES
        src/SharedArray.cpp
        src/JsUtil.cpp
        src/Debug.cpp
        )

if (${BUILD_JSUTIL_TEST})
    # test modules - matches the names of the ts module
    # safe_heap and *sanitize do not play well with each other, test separately as they catch slightly different things
    set(CommonLinkFlags "-O0 -g -s NODEJS_CATCH_REJECTION=0 -s NODEJS_CATCH_EXIT=0 -s IMPORTED_MEMORY -s MODULARIZE=1")
    set(CommonCompileFlags "-O0 -g")

    add_executable(asan-test-module "${SOURCE_FILES}")
    set_target_properties(asan-test-module PROPERTIES
            LINK_FLAGS "${CommonLinkFlags} -s INITIAL_MEMORY=512mb -fsanitize=address -fsanitize=undefined -s EXIT_RUNTIME=1"
            COMPILE_FLAGS "${CommonCompileFlags} -fsanitize=address -fsanitize=undefined"
            )
    target_link_libraries(asan-test-module PUBLIC GSL)
    target_include_directories(asan-test-module PUBLIC "$<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>")

    add_executable(safe-heap-test-module "${SOURCE_FILES}")
    set_target_properties(safe-heap-test-module PROPERTIES
            LINK_FLAGS "${CommonLinkFlags} -s INITIAL_MEMORY=8192kb -s ALLOW_MEMORY_GROWTH=1 -s SAFE_HEAP -fsanitize=undefined"
            COMPILE_FLAGS "${CommonCompileFlags}"
            )
    target_link_libraries(safe-heap-test-module PUBLIC GSL)
    target_include_directories(safe-heap-test-module PUBLIC "$<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>")
endif ()

# create library
add_library(JsUtil STATIC "${SOURCE_FILES}")
target_link_libraries(JsUtil PUBLIC GSL)

# add include directories
target_include_directories(JsUtil
        PUBLIC
        "$<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>"
        "$<INSTALL_INTERFACE:include>"
        )
