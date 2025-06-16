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

import Blits from '@lightningjs/blits'
import List from '../components/List.js';
import { warmup } from '../../../../shared/utils/warmup.js'
import {
  clearTest,
  sequence,
  printResults,
  createManyTiles,
  updateMany,
} from '../perf.js'
import { run } from '../../../../shared/utils/run.js'

const results = {}

export default Blits.Component('Benchmark', {
  components: { List },
  template: `
    <Element>
      <List :items="$items" />
    </Element>
  `,
  state() {
    return {
      items: [],
    }
  },
  hooks: {
    async ready() {
      sequence([
        () => this.testCreateMany(),
        //() => this.testUpdateMany(),
        //() => this.testClear(),
        () => printResults(results),
      ])
    },
  },
  methods: {
    async testCreateMany() {
      await warmup(createManyTiles.bind(this), 50, 5)
      const { average: createAvg, spread: createSpread } = await run(createManyTiles.bind(this), 5, 5)
      results.create = `${createAvg.toFixed(2)}ms ±${createSpread.toFixed(2)}`
    },
    async testUpdateMany() {
      await createManyTiles.call(this, 1000)
      await warmup(updateMany.bind(this), 0, 5)
      await createManyTiles.call(this, 1000)

      const { average: updateAvg, spread: updateSpread } = await run(updateMany.bind(this), 0, 5)
      results.update = `${updateAvg.toFixed(2)}ms ±${updateSpread.toFixed(2)}`
    },
    async testClear() {
      await warmup(clearTest.bind(this), 1000, 5)
      const { average: clearAvg, spread: clearSpread } = await run(clearTest.bind(this), 10000, 5)
      results.clear = `${clearAvg.toFixed(2)}ms ±${clearSpread.toFixed(2)}`
    },
  },
})
