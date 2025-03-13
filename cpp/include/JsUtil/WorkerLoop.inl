#pragma once

namespace JsUtil
{

template <WithWorkerLoopConfig TConfig>
WorkerLoop<TConfig>::~WorkerLoop()
{
    stop(true);
    {
        std::unique_lock lock(m_state_mutex);
        deleteThread();
    }
}

template <WithWorkerLoopConfig TConfig>
bool WorkerLoop<TConfig>::start(bool tickOnStart)
{
    bool started{false};
    {
        std::unique_lock lock(m_state_mutex);

        if (m_loop_state != eRUNNING)
        {
            deleteThread();
            m_notification = eNO_NOTIFICATION;
            Debug::onBeforeAllocate();

            // the thread may not outlive the WorkerLoop, so no special measures are required for lifecycles
            m_thread = std::unique_ptr<std::thread>{new (std::nothrow) std::thread([this, tickOnStart]() {
                m_config.onReady();

                // consume one notification if not tick on start
                if (!tickOnStart && consumeNotification() == eEND)
                {
                    // end happened before we got a tick
                }
                else
                {
                    // the wait (consumeNotification) must come after the operation for `isRunning` not to be a lie
                    // i.e. the job would be marked as complete while it was still running otherwise
                    do
                    {
                        m_config.onTick();
                    } while (consumeNotification() != eEND);
                }

                // notify before setting the state, ensures that all work is done once the state becomes complete
                // the callee will know it's complete because we just told them it is so...
                m_config.onComplete();

                {
                    std::unique_lock lock(m_state_mutex);
                    m_loop_state = eCOMPLETE;
                }
                m_state_cv.notify_all();
            })};

            if (m_thread != nullptr)
            {
                started = true;
                m_loop_state = eRUNNING;
            }
            else
            {
                m_loop_state = eCOMPLETE;
            }
        }
    }

    if (started)
    {
        m_state_cv.notify_all();
    }

    return started;
}

template <WithWorkerLoopConfig TConfig>
void WorkerLoop<TConfig>::stop(bool wait) noexcept
{
    setWorkerNotification(eEND);

    if (wait)
    {
        awaitCompletion();
    }
}

template <WithWorkerLoopConfig TConfig>
void WorkerLoop<TConfig>::awaitCompletion() noexcept
{
    std::unique_lock lock(m_state_mutex);

    if (m_loop_state == eRUNNING)
    {
        m_state_cv.wait(lock, [this]() { return m_loop_state == eCOMPLETE; });
    }
}

template <WithWorkerLoopConfig TConfig>
TConfig& WorkerLoop<TConfig>::getTaskConfig() noexcept
{
    return m_config;
}

template <WithWorkerLoopConfig TConfig>
bool WorkerLoop<TConfig>::isRunning() const noexcept
{
    std::unique_lock lock(m_state_mutex);
    return m_loop_state == eRUNNING;
}

template <WithWorkerLoopConfig TConfig>
void WorkerLoop<TConfig>::proceed()
{
    setWorkerNotification(eSPIN_LOOP);
}

template <WithWorkerLoopConfig TConfig>
void WorkerLoop<TConfig>::setWorkerNotification(ENotification notification) noexcept
{
    {
        std::unique_lock lock(m_state_mutex);
        m_notification = notification;
    }

    m_notification_cv.notify_all();
}

template <WithWorkerLoopConfig TConfig>
typename WorkerLoop<TConfig>::ENotification WorkerLoop<TConfig>::consumeNotification()
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

template <WithWorkerLoopConfig TConfig>
void WorkerLoop<TConfig>::deleteThread()
{
    if (m_thread != nullptr && m_thread->joinable())
    {
        m_thread->join();
    }
    m_thread.reset(nullptr);
}

} // namespace JsUtil