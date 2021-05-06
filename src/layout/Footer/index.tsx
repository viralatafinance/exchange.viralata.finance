import { Grid, Link, Page, Spacer, Text, useMediaQuery } from "@geist-ui/react";
import React from "react";
import styled from "styled-components";

const Footer: React.FC = () => {
  const isDesktop = useMediaQuery("md", { match: "up" });

  const StyledPageFooter = styled(Page.Footer)`
    padding: 15px 20px;
    background-color: rgba(255, 255, 255, 0.97);
    z-index: 998;
    background: #000;
    width: 100% !important;
    position: relative !important;
    margin-top: auto;
  `;

  const StyledContent = styled.div`
    width: 100%;
    margin: 0px auto;
    max-width: 1400px;
    color: white;
  `;

  const StyledContentTop = styled(StyledContent)`
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding: 60px 20px 30px 20px !important;
  `;

  const StyledContentBottom = styled(StyledContent)`
    padding: 30px 20px !important;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9em;
    font-weight: bold;

    ${!isDesktop &&
    ` width: 100%;
      text-align: center;

      & div {        
        justify-content: center;
      }
    `}
  `;

  const StyledLink = styled(Link)`
    &:hover {
      color: #4bf2cd !important;
    }
  `;

  const StyledSocialMediaLinks = styled.div`
    ${!isDesktop &&
    `
    width: 100%;
    text-align: center
  `}
  `;

  return (
    <StyledPageFooter>
      <StyledContentTop>
        <Grid.Container gap={2} justify="center">
          <Grid xs={12} sm={8} style={{ marginBottom: 20 }}>
            <div>
              <Text h3>CYBERICO</Text>
              <StyledLink href="#">Home</StyledLink>
              <Spacer y={0.5} />
              <StyledLink href="#">Trade</StyledLink>
              <Spacer y={0.5} />
              <StyledLink href="#">Staking</StyledLink>
              <Spacer y={0.5} />
              <StyledLink href="#">FAQ</StyledLink>
            </div>
          </Grid>
          <Grid xs={12} sm={8} style={{ marginBottom: 20 }}>
            <div>
              <Text h3>CONTRACTS</Text>
              <StyledLink href="#">CYCO Token</StyledLink>
              <Spacer y={0.5} />
              <StyledLink href="#">Cyberico Contract</StyledLink>
            </div>
          </Grid>
          <Grid xs={24} sm={8} style={{ marginBottom: 20 }}>
            <StyledSocialMediaLinks>
              <Text h3>SOCIAL MEDIA</Text>
              <StyledLink href="#">Telegram</StyledLink>
              <Spacer y={0.5} />
              <StyledLink href="#">Twitter</StyledLink>
              <Spacer y={0.5} />
              <StyledLink href="#">Medium</StyledLink>
              <Spacer y={0.5} />
              <StyledLink href="#">Github</StyledLink>
            </StyledSocialMediaLinks>
          </Grid>
        </Grid.Container>
      </StyledContentTop>
      <StyledContentBottom>
        <Grid.Container gap={2} justify={isDesktop ? "flex-start" : "center"}>
          <Grid xs={!isDesktop && 24}>
            © Cyberico, Inc. All rights reserved.
          </Grid>
          <Grid>
            <StyledLink href="#">Terms</StyledLink>
          </Grid>
          <Grid>
            <StyledLink href="#">Privacy Policy</StyledLink>
          </Grid>
        </Grid.Container>
      </StyledContentBottom>
    </StyledPageFooter>
  );
};
export default Footer;
