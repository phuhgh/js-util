cmake_minimum_required(VERSION 3.17)
project(JsUtil)

# todo jack: do this per target, this isn't actually used in the build...
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_LIST_DIR}/cpp")
add_subdirectory(cpp)