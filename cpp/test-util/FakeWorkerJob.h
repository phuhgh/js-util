#pragma once

#include "JsUtil/WorkerLoop.h"
#include <emscripten/em_macros.h>

class FakeWorkerJob : public JsUtil::WorkerLoop::IConfig
{
  public:
    std::atomic<unsigned> m_ready_calls{0};
    std::atomic<unsigned> m_tick_calls{0};
    std::atomic<unsigned> m_complete_calls{0};

    void onReady() override { ++m_ready_calls; }
    void onTick() override { ++m_tick_calls; }
    void onComplete() override { ++m_complete_calls; }
};

// todo jack: the bindings for javascript...
/**
 * todo jack: some sort of factory or just cache, we really don't need to new. This would allow us some choice in memory
 * arrangement
 */
extern "C"
{
    EMSCRIPTEN_KEEPALIVE
    void fakeWorkerJob_createOne()
    {
    }

    EMSCRIPTEN_KEEPALIVE
    void fakeWorkerJob_destroy(int _statusCode)
    {
    }
}