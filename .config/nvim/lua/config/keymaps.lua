-- Keymaps are automatically loaded on the VeryLazy event
-- Default keymaps that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/keymaps.lua
-- Add any additional keymaps here

local discipline = require("craftzdog.discipline")

discipline.cowboy()

local keymap = vim.keymap
local opts = { noremap = true, silent = true }

keymap.set("n", "te", ":tabedit")
keymap.set("n", "<tab>", ":tabnext<Return>", opts)
keymap.set("n", "<s-tab>", ":tabprev<Return>", opts)

-- keymap.set("n", "<leader>ac", ":TabnineChat<Return>", opts) -- Open Tabnine Chat
-- keymap.set("n", "<leader>af", ":TabnineFix<Return>", opts) -- Fix the function in scope
-- keymap.set("n", "<leader>at", ":TabnineTest<Return>", opts) -- Generate tests for the function in scope
-- keymap.set("n", "<leader>ae", ":TabnineExplain<Return>", opts) -- Explain the function in scope
