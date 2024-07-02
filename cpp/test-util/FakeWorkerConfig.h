#pragma once

#include "JsUtil/Debug.h"
#include "JsUtil/WorkerLoop.h"

class FakeWorkerConfig : public JsUtil::IWorkerLoopConfig
{
  public:
    std::shared_ptr<std::atomic<unsigned>> m_ready_calls{std::make_shared<std::atomic<unsigned>>(0)};
    std::shared_ptr<std::atomic<unsigned>> m_tick_calls{std::make_shared<std::atomic<unsigned>>(0)};
    std::shared_ptr<std::atomic<unsigned>> m_complete_calls{std::make_shared<std::atomic<unsigned>>(0)};

    void onRegistered(JsUtil::INotifiable*) override {};
    void onReady() override { ++(*m_ready_calls); }
    void onTick() override { ++(*m_tick_calls); }
    void onComplete() override { ++(*m_complete_calls); }
};