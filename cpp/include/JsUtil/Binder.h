#pragma once

namespace JsUtil
{

class Binder
{
  public:
    class JsCallback
    {
      public:
        explicit JsCallback(unsigned index)
            : m_index(index)
        {
        }
        ~JsCallback();
        JsCallback(JsCallback&& other) noexcept
            : m_index(other.m_index)
        {
            other.m_index = -1;
        }
        JsCallback& operator=(JsCallback&& other) noexcept
        {
            if (&other != this)
            {
                m_index = other.m_index;
                other.m_index = -1;
            }

            return *this;
        }

        void callback();

      private:
        unsigned m_index;
    };

    static JsCallback getCallback();
};

} // namespace JsUtil