cmake_minimum_required(VERSION 3.1.3...3.16)
project(GSL
        VERSION 3.1.0
        LANGUAGES CXX
        )

# Creates a library GSL which is an interface (header files only)
add_library(GSL INTERFACE)

# NOTE: If you want to use GSL prefer to link against GSL using this alias target
# EX:
#   target_link_libraries(foobar PRIVATE Microsoft.GSL::GSL)
#
# Add Microsoft.GSL::GSL alias for GSL so that dependents can be agnostic about
# whether GSL was added via `add_subdirectory` or `find_package`
add_library(Microsoft.GSL::GSL ALIAS GSL)

# Add include folders to the library and targets that consume it
# the SYSTEM keyword suppresses warnings for users of the library
#
# By adding this directory as an include directory the user gets a
# namespace effect.
#
# IE:
#   #include <gsl/gsl>
if(NOT GSL_STANDALONE_PROJECT)
    target_include_directories(GSL INTERFACE
        $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}>
        $<INSTALL_INTERFACE:${CMAKE_INSTALL_INCLUDEDIR}>
    )
else()
    target_include_directories(GSL SYSTEM INTERFACE
        $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}>
        $<INSTALL_INTERFACE:${CMAKE_INSTALL_INCLUDEDIR}>
    )
endif()
