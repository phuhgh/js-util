set(JsUtil_LIBRARIES "JsUtil")
set(JsUtilVersion "9.0")

if (NOT TARGET JsUtil)
    include(JsUtilFunctions)
    jsu_initializeModule(JsUtil)

    if (${BUILD_JSUTIL_TEST})
        set(pedantic_flags "-Werror -Wall -Wextra -pedantic")
        set(pedantic_flags "")
    else ()
        set(pedantic_flags "")
    endif ()

    message(STATUS "todo jack: ${CMAKE_CURRENT_LIST_DIR}")

    jsu_create_libray(JsUtil
            SOURCE_FILES src/*.cpp
            PUBLIC_INCLUDE_DIRS "${CMAKE_CURRENT_LIST_DIR}/include"
            COMPILE_OPTIONS "${pedantic_flags}"
            )
endif ()

include(FindPackageHandleStandardArgs)
find_package_handle_standard_args(JsUtil
        VERSION_VAR JsUtilVersion
        REQUIRED_VARS JsUtil_LIBRARIES
        )
