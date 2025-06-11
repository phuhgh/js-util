#pragma once

namespace JsUtilQuadTree
{

inline std::array<JsUtil::Range2d<uint16_t>, 4> getQuads(JsUtil::Range2d<uint16_t> node)
{
    auto const width = wasm_u32x4_splat(node.getXRange() / 2);
    auto const height = wasm_u32x4_splat(node.getYRange() / 2);
    auto const xMin = wasm_u32x4_splat(node.xMin());
    auto const yMin = wasm_u32x4_splat(node.yMin());

    // SE: (0, 0), SW: (1, 0), NW: (0, 1), NE: (1, 1)
    auto const quad_xMin = wasm_i32x4_add(xMin, wasm_i32x4_mul(wasm_u32x4_make(0, 1, 0, 1), width));
    auto const quad_yMin = wasm_i32x4_add(yMin, wasm_i32x4_mul(wasm_u32x4_make(0, 0, 1, 1), width));

    auto const quad_xMax = wasm_i32x4_add(quad_xMin, width);
    auto const quad_yMax = wasm_i32x4_add(quad_yMin, height);

    std::array<JsUtil::Range2d<uint16_t>, 4> quads{
        {JsUtil::Range2d<uint16_t>{
             {static_cast<uint16_t>(wasm_u32x4_extract_lane(quad_xMin, 0)),
              static_cast<uint16_t>(wasm_u32x4_extract_lane(quad_yMin, 0)),
              static_cast<uint16_t>(wasm_u32x4_extract_lane(quad_xMax, 0)),
              static_cast<uint16_t>(wasm_u32x4_extract_lane(quad_yMax, 0))}
         },
         JsUtil::Range2d<uint16_t>{
             {static_cast<uint16_t>(wasm_u32x4_extract_lane(quad_xMin, 1)),
              static_cast<uint16_t>(wasm_u32x4_extract_lane(quad_yMin, 1)),
              static_cast<uint16_t>(wasm_u32x4_extract_lane(quad_xMax, 1)),
              static_cast<uint16_t>(wasm_u32x4_extract_lane(quad_yMax, 1))}
         },
         JsUtil::Range2d<uint16_t>{
             {static_cast<uint16_t>(wasm_u32x4_extract_lane(quad_xMin, 2)),
              static_cast<uint16_t>(wasm_u32x4_extract_lane(quad_yMin, 2)),
              static_cast<uint16_t>(wasm_u32x4_extract_lane(quad_xMax, 2)),
              static_cast<uint16_t>(wasm_u32x4_extract_lane(quad_yMax, 2))}
         },
         JsUtil::Range2d<uint16_t>{
             {static_cast<uint16_t>(wasm_u32x4_extract_lane(quad_xMin, 3)),
              static_cast<uint16_t>(wasm_u32x4_extract_lane(quad_yMin, 3)),
              static_cast<uint16_t>(wasm_u32x4_extract_lane(quad_xMax, 3)),
              static_cast<uint16_t>(wasm_u32x4_extract_lane(quad_yMax, 3))}
         }},
    };

    return quads;
}

} // namespace JsUtilQuadTree