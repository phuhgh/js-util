#pragma once

namespace JsUtil
{

template <WorkerLoopConfigExt TConfig> WorkerLoop<TConfig>::~WorkerLoop()
{
    stop(true);
    safeDeleteThread();
}

template <WorkerLoopConfigExt TConfig> bool WorkerLoop<TConfig>::start(bool tickOnStart)
{
    bool started{false};
    {
        std::unique_lock lock(m_state_mutex);

        if (m_loop_state == eREADY_TO_START || m_loop_state == eCOMPLETE)
        {
            safeDeleteThread();
            m_loop_state = eRUNNING;
            m_notification = tickOnStart ? eSPIN_LOOP : eNO_NOTIFICATION;

            // the thread may not outlive the WorkerLoop, so no special measures are required for lifecycles
            m_thread = new (std::nothrow) std::thread([this, tickOnStart]() {
                m_config.onReady();

                if (!tickOnStart && consumeNotification() == eEND)
                {
                    // end happened before we got a tick
                }
                else
                {
                    // the wait (consumeNotification) must come after the operation for `isRunning` not to be a lie
                    while (true)
                    {
                        m_config.onTick();
                        if (consumeNotification() == eEND)
                        {
                            break;
                        }
                    }
                }

                {
                    std::unique_lock lock(m_state_mutex);
                    m_loop_state = eCOMPLETE;
                }
                m_state_cv.notify_all();
                // notify after setting the state, in case downstream uses this to check if the job is done
                m_config.onComplete();
            });

            if (m_thread != nullptr)
            {
                started = true;
            }
        }
    }

    if (started)
    {
        m_state_cv.notify_all();
    }

    return started;
}

template <WorkerLoopConfigExt TConfig> void WorkerLoop<TConfig>::stop(bool wait)
{
    setWorkerNotification(eEND);

    if (wait)
    {
        awaitCompletion();
    }
}

template <WorkerLoopConfigExt TConfig> void WorkerLoop<TConfig>::awaitCompletion()
{
    std::unique_lock lock(m_state_mutex);

    if (m_loop_state == eRUNNING)
    {
        m_state_cv.wait(lock, [this]() { return m_loop_state == eCOMPLETE; });
    }
}

template <WorkerLoopConfigExt TConfig> TConfig& WorkerLoop<TConfig>::getTask()
{
    return m_config;
}

template <WorkerLoopConfigExt TConfig> bool WorkerLoop<TConfig>::isRunning() const
{
    std::unique_lock lock(m_state_mutex);
    return m_loop_state == eRUNNING;
}

template <WorkerLoopConfigExt TConfig> void WorkerLoop<TConfig>::proceed()
{
    setWorkerNotification(eSPIN_LOOP);
}

template <WorkerLoopConfigExt TConfig>
void WorkerLoop<TConfig>::setWorkerNotification(WorkerLoop::ENotification notification)
{
    {
        std::unique_lock lock(m_state_mutex);
        m_notification = notification;
    }

    m_notification_cv.notify_all();
}

template <WorkerLoopConfigExt TConfig> WorkerLoop<TConfig>::ENotification WorkerLoop<TConfig>::consumeNotification()
{
    std::unique_lock lock(m_state_mutex);

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

template <WorkerLoopConfigExt TConfig> void WorkerLoop<TConfig>::safeDeleteThread()
{
    if (m_thread != nullptr && m_thread->joinable())
    {
        m_thread->join();
    }

    delete m_thread;
}

} // namespace JsUtil