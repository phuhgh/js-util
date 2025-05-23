#pragma once

#include "JsUtil/TypeTraits.hpp"

namespace JsUtil
{

struct IExecutor
{
    virtual ~IExecutor() = default;
    virtual void run() noexcept = 0;
};

template <WithCallable<void> TCallback>
class CallbackExecutor : public IExecutor
{
  public:
     CallbackExecutor(TCallback callback)
        : m_callback(std::move(callback))
    {
    }

    // form IExecutor
    void run() noexcept override { m_callback(); }

  private:
    TCallback m_callback;
};

template <WithCallable<void> TCallback>
CallbackExecutor(TCallback) -> CallbackExecutor<TCallback>;

struct INotifiable
{
    virtual ~INotifiable() = default;
    virtual void proceed() = 0;
};

} // namespace JsUtil