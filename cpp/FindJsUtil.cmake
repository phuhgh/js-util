set(JsUtil_LIBRARIES "JsUtil")
set(JsUtilVersion "10.0")

if (NOT TARGET JsUtil)
    include(JsUtilFunctions)
    jsu_initializeModule(JsUtil)

    if (${BUILD_JSUTIL_TEST})
        set(pedantic_flags -Werror -Wall -Wextra -pedantic -Wbad-function-cast -Wcast-function-type)
    else ()
        set(pedantic_flags "")
    endif ()

    jsu_create_libray(JsUtil
            SOURCE_FILES src/*.cpp
            PUBLIC_INCLUDE_DIRS "${CMAKE_CURRENT_LIST_DIR}/include"
            COMPILE_OPTIONS ${pedantic_flags} -pthread -msimd128
            LINK_OPTIONS -s SIMD=1
            PRIVATE_COMPILE_FEATURES "cxx_std_20"
    )
endif ()

include(FindPackageHandleStandardArgs)
find_package_handle_standard_args(JsUtil
        VERSION_VAR JsUtilVersion
        REQUIRED_VARS JsUtil_LIBRARIES
)
