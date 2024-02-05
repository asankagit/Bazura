import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  selectCount,
  updateYPosition
} from './keyControllerSlice';
import { Button, Flex, Tooltip } from 'antd';

export function Counter(props) {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

  return (
    <div>
      {props.children}
      <div>
        
        <Button
          type="primary" shape="circle" 
          aria-label="Increment value"
          onClick={() => dispatch(updateYPosition(+20))}
        >
          UP
        </Button>
        <span>{count}</span>
        {/* <button
          aria-label="Decrement value"
          onClick={() => dispatch(updateYPosition(-2))}
        >
          Down
        </button> */}
      </div>
      {/* <div>
        <input
          aria-label="Set increment amount"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
        />
        <button
          onClick={() =>
            dispatch(incrementByAmount(Number(incrementAmount) || 0))
          }
        >
          Add Amount
        </button>
        <button
          onClick={() => dispatch(incrementAsync(Number(incrementAmount) || 0))}
        >
          Add Async
        </button>
      </div> */}
    </div>
  );
}
