import { App, Banner, Line, Art, Row, Column, Text, TextInput } from './index.js';

const app = (
  <App align="center">
    <Row align="top">
      <Art sprite="bulb" />
      <Column align="center" gap={1}>
        <Banner font="marker" letterSpacing={1} text="2Bad"/>
        <Banner font="marker" letterSpacing={1} text="Ideas" />
        <Line width={24} />
        <Banner font="pencil" text="Studios" />
      </Column>
    </Row>
    <TextInput width={54} gap={{top: 1}} />
    <Text>enter your email to receive updates</Text>
  </App>
);

await app.start();
