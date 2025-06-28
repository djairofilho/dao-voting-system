// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BCIToken
 * @dev Token ERC20 para o sistema de votação DAO
 * @author Blockchain Insper
 */
contract BCIToken is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 10000 * 10**18; // 10.000 tokens
    
    /**
     * @dev Constructor que cria o token BCI
     * @param initialOwner Endereço do proprietário inicial
     */
    constructor(address initialOwner) ERC20("Blockchain Insper", "BCI") Ownable(initialOwner) {
        _mint(initialOwner, INITIAL_SUPPLY);
    }
    
    /**
     * @dev Função para mint de novos tokens (apenas owner)
     * @param to Endereço de destino
     * @param amount Quantidade de tokens
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    /**
     * @dev Função para burn de tokens (apenas owner)
     * @param amount Quantidade de tokens para queimar
     */
    function burn(uint256 amount) external onlyOwner {
        _burn(msg.sender, amount);
    }
    
    /**
     * @dev Função para distribuir tokens iniciais para membros da DAO
     * @param recipients Array de endereços
     * @param amounts Array de quantidades
     */
    function distributeTokens(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient address");
            require(amounts[i] > 0, "Amount must be greater than 0");
            _transfer(msg.sender, recipients[i], amounts[i]);
        }
    }
} 