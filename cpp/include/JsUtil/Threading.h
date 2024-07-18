#pragma once

#include "JsUtil/TypeTraits.h"

namespace JsUtil
{

struct IExecutor
{
    virtual ~IExecutor() = default;
    virtual void run() = 0;
};

template <IsVoidCallback TCallback>
class CallbackExecutor : public IExecutor
{
  public:
    explicit CallbackExecutor(TCallback callback)
        : m_callback(std::move(callback))
    {
    }

    // form IExecutor
    void run() override { m_callback(); }

  private:
    TCallback m_callback;
};

struct INotifiable
{
    virtual ~INotifiable() = default;
    virtual void proceed() = 0;
};

} // namespace JsUtil