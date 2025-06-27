/*
 * Copyright 2024 Comcast Cable Communications Management, LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
    createSignal,
    For,
    Show,
    Index
  } from "solid-js";
import { Text, View } from "@lightningtv/solid";
import { Row } from "@lightningtv/solid/primitives";
import sampleData from '../../sample.js';

import { colours, adjectives, nouns } from '../../../shared/data.js';
import { warmup } from "../../../shared/utils/warmup.js";
import { waitUntilIdle } from "../../../shared/utils/waitUntilIdle.js";
import { run } from "../../../shared/utils/run.js";

import { pick } from "./utils/pick.js";
import { getRenderer } from "./utils/renderer.js";

function buildData(count) {
    let data = new Array(count);
    for (let i = 0; i < count; i++) {
        data[i] = {
            label: `${pick(adjectives)} ${pick(nouns)}`,
            color: pick(colours),
            textColor: pick(colours),
            width: 200,
            height: 40,
            x: (i % 27 * 40),
            y: ~~( i / 27 ) * 40,
            fontSize: 26
        }
    }

    return data;
}

function buildTiles() {
    const imgpath = sampleData.imgpath;
    const results = sampleData.results;

    const items = results
    .map((item, index) => {
        const title = item.title || item.name; // Use title or name
        const posterPath = item.poster_path;

        // Create tile only if title and posterPath are available for the item
        return {
        id: index,
        title: title,
        width: 185,
        height: 278,
        src: imgpath + posterPath,
        };
    })
    return items;
}

const Tile = (props) => {
  return (
    <view src={props.item.src} width={props.item.width} height={props.item.height}>
      <text
        x={5}
        y={240}
        fontFamily={"Ubuntu"}
        fontSize={16}
      >
        {props.item.title}
      </text>
    </view>
  );
};

const Benchmark = () => {
    let container;
    const renderer = getRenderer();
    const [screenResults, setScreenResults] = createSignal('Start');

    const [data, setData] = createSignal([]),
    createMany = (amount = 10) => {
        return clear().then(() => {
            return new Promise((resolve) => {
                const createPerf = performance.now();
                // waitUntilIdle(renderer, createPerf).then(time => {
                //     resolve({ time });
                // });

                setData(buildTiles());
                resolve({ time: performance.now() - createPerf });
            });
        });
    },
    clear = () => { 
        return new Promise((resolve) => {
            if (!data().length) {
                resolve({ time: 0 });
                return;
            }

            const clearPerf = performance.now();
            waitUntilIdle(renderer, clearPerf).then(time => {
                resolve({ time });
            });
            setData([]);
        });
    },
    appendMany = (amount = 1000) => {
        return new Promise((resolve) => {
            createMany(1000).then( () => {
                const appendPerf = performance.now();
                waitUntilIdle(renderer, appendPerf).then(time => {
                    resolve({ time });
                });
    
                setData([...data(), ...buildData(amount)]);
            });
        });
    },
    updateMany = (count = 1000, skip = 0) => {
        return new Promise((resolve) => {
            const updatePerf = performance.now();
            waitUntilIdle(renderer, updatePerf).then(time => {
                resolve({ time });
            });

            // const d = data.slice();
            // for(let i = 0, len = d.length; i < len; i += (skip + 1)) {
            //     const row = d[i];
            //     row.label = `${pick(adjectives)} ${pick(nouns)}`;
            //     row.color = pick(colours);
            //     row.textColor = pick(colours);
            // }
            // have to trigger a new one else the reactivity doesn't work
            // setData(d);

            setData((items) => items.map((row, i) => (
              i % (skip + 1) === 0 ? { ...row, label: `${pick(adjectives)} ${pick(nouns)}`, color: pick(colours), textColor: pick(colours) } : row
          )));

            
        });
    },
    clearTest = () => {
        return new Promise( resolve => {  
            waitUntilIdle(renderer, performance.now()).then( time => {
                clear().then( time => {
                    resolve(time);
                });
            });
   
            setData(buildData(1000))
        })
    },
    runBenchmark = async () => {
        const results = {};

        await warmup(createMany, 50, 5);
        const { average: createAvg, spread: createSpread } = await run(createMany, 20, 50);
        results.create = `${createAvg.toFixed(2)}ms ±${createSpread.toFixed(2)}`;
        setScreenResults(results.create);

        // await createMany(50);
        // await warmup(updateMany, 50, 5);
        // await createMany(50);
        // const { average: updateAvg, spread: updateSpread } = await run(updateMany, 50, 5);
        // results.update = `${updateAvg.toFixed(2)}ms ±${updateSpread.toFixed(2)}`;
    
        // await createMany(1000);
        // await warmup(updateMany, [1000, 10], 5);
        // await createMany(1000);
        // const { average: skipNthAvg, spread: skipNthSpread } = await run(updateMany, [1000, 10], 5);
        // results.skipNth = `${skipNthAvg.toFixed(2)}ms ±${skipNthSpread.toFixed(2)}`;
    
        // await warmup(createMany, 10000, 5);
        // const { average: createLotsAvg, spread: createLotsSpread } = await run(createMany, 10000, 5);
        // results.createLots = `${createLotsAvg.toFixed(2)}ms ±${createLotsSpread.toFixed(2)}`;
    
        // await warmup(appendMany, 1000, 5);
        // const { average: appendAvg, spread: appendSpread } = await run(appendMany, 10000, 5);
        // results.append = `${appendAvg.toFixed(2)}ms ±${appendSpread.toFixed(2)}`;
    
        // await warmup(clearTest, 1000, 5);
        // const { average: clearAvg, spread: clearSpread } = await run(clearTest, 10000, 5);
        // results.clear = `${clearAvg.toFixed(2)}ms ±${clearSpread.toFixed(2)}`;

        Object.keys(results).forEach(key => {
            console.log(`${key}: ${results[key]}ms`);
        });

        console.log('Done!', results);
    }

    console.log('starting benchmark');
    setTimeout(runBenchmark, 1000);

    return (
    <>
        <Row ref={container} gap={10}>
          <Index each={data()}>{(item) => (
            <Tile item={item()} />
          )}</Index>
        </Row>
        <text fontSize={24} fontFamily={"Ubuntu"} color={0x000000ff} x={10} y={300}>{screenResults()}</text>
    </>
  );
};

export default Benchmark;