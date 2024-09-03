#include "JsUtil/Binder.hpp"
#include <emscripten/em_js.h>
#include <emscripten/em_macros.h>

// ideally we'd just use val.h, but it seems like the way linking flags are supplied would be a pain downstream...
// very simple interop covers a lot of cases, so provide some very basic bindings that play nice with our build system
enum EBINDER_KIND
{
    eCALLBACK = 1,
};

EM_JS(unsigned, jsu_binderGetLast, (unsigned expectedType), { Module.JSU_BINDER.getLast(); });
EM_JS(unsigned, jsu_binderRemove, (unsigned index), { Module.JSU_BINDER.remove(index); });
EM_JS(unsigned, jsu_binderCb, (unsigned index), { Module.JSU_BINDER.callback(index); });

namespace JsUtil
{

void Binder::JsCallback::callback()
{
    jsu_binderCb(m_index);
}
Binder::JsCallback::~JsCallback()
{
    jsu_binderRemove(m_index);
}

Binder::JsCallback Binder::getCallback()
{
    return Binder::JsCallback(jsu_binderGetLast(eCALLBACK));
}

} // namespace JsUtil
