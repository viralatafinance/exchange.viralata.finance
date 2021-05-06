import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    // background-color: ${({ theme }) => theme.colors.background};

    img {
      height: auto;
      max-width: 100%;
    }

    & .tooltip-content {
      z-index: 999999 !important;
    }
  }

  html,
  button,
  input,
  select,
  textarea {
    font-family: "Source Sans Pro", Helvetica, sans-serif !important;
  }

  .currencies-modal {
    padding: 0px !important;
  }
`

export default GlobalStyle
