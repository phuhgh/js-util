#include "JsUtilEntityComponent/Entities.hpp"
#include <emscripten/em_macros.h>

extern "C"
{
    EMSCRIPTEN_KEEPALIVE
    JsInterop::ASharedMemoryObject* vtCreateGroup()
    {
        return JsInterop::createSharedMemoryOwner(JsUtilQuadTree::EntityGroup::createOne(), {});
    }

    EMSCRIPTEN_KEEPALIVE
    bool vtAddEntityToGroup(
        JsInterop::SharedMemoryOwner<JsUtilQuadTree::EntityGroup>* group,
        JsInterop::SharedMemoryOwner<JsUtilQuadTree::Entity>*      entity
    )
    {
        return group->m_owningPtr->addEntity(entity->m_owningPtr);
    }

    EMSCRIPTEN_KEEPALIVE
    bool vtRemoveEntityFromGroup(
        JsInterop::SharedMemoryOwner<JsUtilQuadTree::EntityGroup>* group,
        JsInterop::SharedMemoryOwner<JsUtilQuadTree::Entity>*      entity
    )
    {
        return group->m_owningPtr->removeEntity(entity->m_owningPtr);
    }

    EMSCRIPTEN_KEEPALIVE
    JsInterop::ASharedMemoryObject* vtCreateEntity()
    {
        return JsInterop::createSharedMemoryOwner(JsUtilQuadTree::Entity::createOne(), {});
    }
}