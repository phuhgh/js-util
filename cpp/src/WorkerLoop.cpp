#include "JsUtil/WorkerLoop.h"
#include <emscripten/em_macros.h>

namespace JsUtil
{

struct WorkerLoop::JsToken
{

};

}

// todo jack: the bindings for javascript...
extern "C"
{
    EMSCRIPTEN_KEEPALIVE
    void workerLoop_create()
    {
    }
}