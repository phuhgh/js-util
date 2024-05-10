#pragma once

#include <iostream>

namespace JsUtil
{

WorkerLoop::~WorkerLoop()
{
    stop(true);
};

void WorkerLoop::start()
{
    Debug::assert(m_thread == nullptr, "tried to start thread which is already running");

    // todo jack: you might as well use pimpl going this way...
    auto config = m_config;
    m_thread = std::make_unique<std::thread>([config, this]() {
        config->onReady();

        while (consumeNotification() != eEND)
        {
            m_config->onTick();
        };

        m_config->onComplete();
    });
}

WorkerLoop::ENotification WorkerLoop::consumeNotification()
{
    std::unique_lock lock(m_notification_mutex);

    if (m_notification != eNO_NOTIFICATION)
    {
        auto notification = m_notification;
        m_notification = eNO_NOTIFICATION;
        return notification;
    }

    m_notification_cv.wait(lock, [this]() { return m_notification != eNO_NOTIFICATION; });
    auto notification = m_notification;
    m_notification = eNO_NOTIFICATION;
    return notification;
}

void WorkerLoop::stop(bool wait)
{
    if (!m_thread)
    {
        return;
    }

    {
        std::unique_lock<std::mutex> lock(m_notification_mutex);
        m_notification = eEND;
    }
    m_notification_cv.notify_one();

    if (wait)
    {
        m_thread->join();
    }
}

void WorkerLoop::proceed()
{
    Debug::assert(m_thread != nullptr, "expected job to have been started");
    {
        std::unique_lock<std::mutex> lock(m_notification_mutex);
        m_notification = eSPIN;
    }
    m_notification_cv.notify_one();
}

} // namespace JsUtil