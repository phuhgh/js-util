cmake_minimum_required(VERSION 3.17)
set(CMAKE_CXX_STANDARD 14)
project(jsutil)

set(EMSCRIPTEN_ROOT $ENV{EMSDK}/upstream/emscripten CACHE STRING "Emscripten path")
set(CMAKE_TOOLCHAIN_FILE ${EMSCRIPTEN_ROOT}/cmake/Modules/Platform/Emscripten.cmake)

add_executable(test-module src/SharedVector.cpp)
set_target_properties(test-module PROPERTIES LINK_FLAGS "-O0 -g -Weverything -s IMPORTED_MEMORY -s ALLOW_MEMORY_GROWTH=1 -s MODULARIZE=1")

add_library(jsutil src/SharedVector.cpp)
target_include_directories(jsutil PUBLIC include/)

if (CMAKE_CXX_COMPILER_ID STREQUAL "CLANG")
    target_compile_options(jsutil PRIVATE -Werror -Wall -Wextra -pedantic)
elseif (CMAKE_CXX_COMPILER_ID STREQUAL "MSVC")
    target_compile_options(jsutil PRIVATE /W4)
endif()

set(CMAKE_CXX_VISIBILITY_PRESET  hidden)
set(CMAKE_VISIBILITY_INLINES_HIDDEN YES)
include(GenerateExportHeader)
generate_export_header(jsutil)