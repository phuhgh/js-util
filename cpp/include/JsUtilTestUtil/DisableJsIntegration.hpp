#pragma once

#include "JsUtil/Debug.hpp"

class DisableJsIntegration
{
public:
    DisableJsIntegration() { JsUtil::Debug::disableJsIntegration(); }
};
