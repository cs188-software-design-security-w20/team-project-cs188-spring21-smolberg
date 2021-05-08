import { useState } from "react"

const useInput = (iv) => {
    const [v, setV] = useState(iv)
    return {
        v,
        setV,
        reset: () => setV(''),
        bind: {
            v,
            onChange: e => {
                setV(e.target.value)
            }
        }
    }
}

export default useInput