'use client'
import { JSONTree } from 'react-json-tree'

const theme = {
    scheme: 'joy-ui',
    author: 'Adapted from MUI Joy theme',
    base00: '#ffffff', // background
    base01: '#f5f5f5', // lighter background
    base02: '#f5f5f5', // selection background
    base03: '#9e9e9e', // comments, invisibles
    base04: '#757575', // dark foreground
    base05: '#212121', // default foreground
    base06: '#424242', // light foreground
    base07: '#ffffff', // light background
    base08: '#d32f2f', // variables, red
    base09: '#ed6c02', // integers, orange
    base0A: '#ffa000', // class names, yellow
    base0B: '#2e7d32', // strings, green
    base0C: '#0288d1', // support, cyan
    base0D: '#0a69da', // functions/methods, blue
    base0E: '#9c27b0', // keywords, purple
    base0F: '#795548', // deprecated, brown
  };

export default function ShowJSON({ data }) {
    return <JSONTree theme={theme} data={data} />
}