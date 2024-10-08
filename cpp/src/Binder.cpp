#include "JsUtil/Binder.hpp"
#include <emscripten/em_js.h>
#include <emscripten/em_macros.h>

// ideally we'd just use val.h, but it seems like the way linking flags are supplied would be a pain downstream...
// very simple interop covers a lot of cases, so provide some very basic bindings that play nice with our build system
EM_JS(unsigned, jsu_removeBinder, (unsigned index), { Module.JSU_BINDER.removeBinder(index); });
EM_JS(unsigned, jsu_binderCb, (unsigned index), { Module.JSU_BINDER.getBinder(index)(); });

namespace JsInterop
{

void JsCallback::callback()
{
    jsu_binderCb(m_index);
}
JsCallback::~JsCallback()
{
    jsu_removeBinder(m_index);
}

} // namespace JsInterop
