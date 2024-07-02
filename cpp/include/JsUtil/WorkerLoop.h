#pragma once

#include "JsUtil/CircularFifoStack.h"
#include "JsUtil/Debug.h"
#include "JsUtil/Threading.h"
#include <condition_variable>
#include <gsl/pointers>
#include <mutex>
#include <thread>

namespace JsUtil
{

struct IWorkerLoopConfig
{
    virtual ~IWorkerLoopConfig() = default;
    // Called on construction of the WorkerLoop
    virtual void onRegistered(INotifiable* workerLoop) = 0;

    /// the thread has been created and is ready to start working
    virtual void onReady() = 0;
    virtual void onTick() = 0;
    /// the thread has been destroyed
    virtual void onComplete() = 0;
};

template <typename T>
concept WorkerLoopConfigExt = std::is_base_of_v<IWorkerLoopConfig, T>;

template <WorkerLoopConfigExt TConfig>
class WorkerLoop
    : public INotifiable
    , public ISharedMemoryObject
{
  public:
    enum EResult : uint8_t
    {
        eSTOP = 1,
        eCONTINUE,
    };

    explicit WorkerLoop(TConfig config)
        : m_config(std::move(config))
    {
        m_config.onRegistered(this);
    };
    WorkerLoop()
        : m_config(TConfig{})
    {
        m_config.onRegistered(this);
    };

    ~WorkerLoop() override;
    WorkerLoop(WorkerLoop const&) = delete;
    WorkerLoop& operator=(WorkerLoop const&) = delete;
    WorkerLoop(WorkerLoop&&) = delete;
    WorkerLoop& operator=(WorkerLoop&&) = delete;

    bool     start(bool tickOnStart = false);
    void     proceed() override;
    void     stop(bool wait = false);
    void     awaitCompletion();
    TConfig& getTask();
    bool     isRunning() const;

  private:
    enum ENotification : uint8_t
    {
        eEND = 1,
        eSPIN_LOOP,
        eNO_NOTIFICATION,
    };
    enum ELoopState : uint8_t
    {
        eREADY_TO_START = 1,
        eRUNNING,
        eCOMPLETE,
    };

    TConfig                  m_config;
    gsl::owner<std::thread*> m_thread{nullptr};
    mutable std::mutex       m_state_mutex; // locks all state below
    std::condition_variable  m_notification_cv;
    ENotification            m_notification{eNO_NOTIFICATION};
    std::condition_variable  m_state_cv;
    ELoopState               m_loop_state{eREADY_TO_START};

    inline void          setWorkerNotification(ENotification notification);
    inline ENotification consumeNotification();
    inline void          safeDeleteThread();
};

} // namespace JsUtil

#include "WorkerLoop.inl"