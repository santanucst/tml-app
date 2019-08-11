import { TutorialAngularCliStylingBootstrapPage } from './app.po';

describe('tutorial-angular-cli-styling-bootstrap App', () => {
  let page: TutorialAngularCliStylingBootstrapPage;

  beforeEach(() => {
    page = new TutorialAngularCliStylingBootstrapPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
