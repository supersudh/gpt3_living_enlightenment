import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Button,
  Container,
  Form,
  FormGroup,
  Input,
  Label
} from 'reactstrap';
import axios from 'axios';

export default class App extends React.Component {
  state = {
    q: '',
    answerText: 'Type your question above and hit enter for the answer...',
    isLoading: false
  }

  onChangeQ = evt => this.setState({ q: evt.target.value });

  getAnswer = async () => {
    try {
      const { isLoading, q } = this.state;
      if (!isLoading && q) {
        this.setState({ isLoading: true, answerText: 'Loading...' });
        const { data } = await axios.get(`https://gpt3-le-be.herokuapp.com/q?question=${q}`);
        console.log(data);
        if (data.length) {
          const maxScoreData = data.reduce((acc, t) => {
            if (t.score > acc.score) {
              return t;
            }
            return acc;
          }, { score: 0 });
          this.setState({
            answerText: maxScoreData.text
          })
        }
      }
    } catch (error) {
      console.log(error);
      this.setState({ isLoading: false, answerText: 'There was an error. Please Try again..' });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  onKeyDownQ = evt => {
    const { isLoading, q } = this.state;
    if (evt.code === "Enter" && !isLoading && q) {
      this.getAnswer();
    }
  }

  onSubmit = evt => {
    evt.preventDefault();
    evt.stopPropagation();
  }

  render() {
    const {
      q,
      answerText,
      isLoading
    } = this.state;

    console.log(answerText);
    return (
      <Container>
        <div style={{ padding: '1rem' }}>
          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              <Input
                bsSize="lg"
                className="mb-3"
                placeholder="type a word, phrase, or question you'd like to learn more about..."
                value={q}
                onChange={this.onChangeQ}
                onKeyDown={this.onKeyDownQ}
                disabled={isLoading}
              />
              <Button
                color="primary"
                onClick={this.getAnswer}
              >
                Ask
              </Button>
            </FormGroup>
          </Form>

          <FormGroup>
            <Label for="exampleText">
              Answer from Living Enlightenment:
            </Label>
            <Input
              name="answer"
              type="textarea"
              rows="20"
              value={answerText}
            />
          </FormGroup>
        </div>
      </Container>
    );
  }
}