export const ERC20ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function name() view returns (string)",
    "function transfer(address to, uint amount) returns (bool)",
    "function approve(address spender, uint256 amount) public  returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint amount)",
    "function allowance(address _owner, address _spender) external view returns (uint256 remaining)",
    "function allowance(address owner, address spender) public view  returns (uint256)"
]

export const UniswapRouterAbi = [
    "function approve(address spender, uint value) external returns (bool)",
    "function removeLiquidity(address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline) external returns(uint amountA, uint amountB)",
    "function removeLiquidityETH(  address token,  uint liquidity,  uint amountTokenMin, nt amountETHMin,  address to,  uint deadline ) external returns(uint amountToken, uint amountETH)",
    "function quote(uint amountA, uint reserveA, uint reserveB) external pure returns(uint amountB)",
    "function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns(uint amountOut)",
    "function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns(uint amountIn)",
    "function getAmountsOut(uint amountIn, address[] calldata path) external view returns(uint[] memory amounts)",
    "function getAmountsIn(uint amountOut, address[] calldata path) external view returns(uint[] memory amounts)",
    "function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn,  uint amountOutMin, address[] calldata path, address to, uint deadline ) external",
    "function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path,  address to, uint deadline ) external payable"
]

export const UniswapFactory = [
    "function getPair(address tokenA, address tokenB) external view returns (address pair)"
]