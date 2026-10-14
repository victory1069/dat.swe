import QuantiDemo from './QuantiDemo'
import BlissDemo from './BlissDemo'
import TaxeerDemo from './TaxeerDemo'
import FundReadyDemo from './FundReadyDemo'
import BridgeDemo from './BridgeDemo'
import './demos.css'

// slug → the demo that runs inside the phone, and its status-bar tone.
export const demos = {
  'quanti-hr': { Demo: QuantiDemo, tone: 'light' },
  'bliss-waka': { Demo: BlissDemo, tone: 'dark' },
  'taxeer-ng': { Demo: TaxeerDemo, tone: 'light' },
  fundready: { Demo: FundReadyDemo, tone: 'light' },
  'the-bridge': { Demo: BridgeDemo, tone: 'dark' },
}
