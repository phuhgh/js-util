#pragma once

// todo jack: use a concept instead, no overhead... ?
#include "JsUtil/Debug.h"
#include <condition_variable>
#include <functional>
#include <memory>
#include <mutex>
#include <optional>
#include <thread>

namespace JsUtil
{

/**
 * todo jack: multithreading
 * - simple async wrapping
 * - observable?
 * - push many, wait once (start, push, push, push... end) the start returns a promise, resolved on end + all jobs
 * complete
 * - stop(bool reset = false)
 *
 * javascript side is a simple factory for a promise or stream of values + asserts that it goes one at a time
 *
 * todo jack: additional considerations
 * - communicating error conditions
 *
 * todo jack: random other
 * - enable compile check for aggregate initialization covering all members
 * - it should not be copyable
 * - destruction logic
 * - the use of asserts might not be appropriate
 * - what about timeouts? Do we care?
 * - How do we destroy a web worker with emscripten?
 */
class WorkerLoop
{
  public:
    enum EResult : uint8_t
    {
        eSTOP = 1,
        eCONTINUE,
    };

    // todo jack: use or lose
    struct JsToken;

    struct IConfig
    {
        virtual ~IConfig() = default;
        virtual void onTick() = 0;
        virtual void onComplete() = 0;
        virtual void onReady() = 0;
    };

    explicit WorkerLoop(std::shared_ptr<IConfig> _config)
        : m_config(std::move(_config)){};
    ~WorkerLoop();

    void start();
    void proceed();
    void stop(bool wait = false);

  private:
    enum ENotification : uint8_t
    {
        eEND = 0,
        eSPIN,
        eNO_NOTIFICATION,
    };

    std::shared_ptr<IConfig>     m_config;
    std::shared_ptr<std::thread> m_thread{nullptr};
    std::condition_variable      m_notification_cv;
    std::mutex                   m_notification_mutex;
    ENotification                m_notification{eNO_NOTIFICATION};

    inline ENotification consumeNotification();
};

} // namespace JsUtil

#include "WorkerLoop.inl"