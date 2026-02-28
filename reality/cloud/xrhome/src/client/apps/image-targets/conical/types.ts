export interface ConicalWizardStep {
  onPrevious?(): void  // user goes to the previous step
  onNext?(): void  // user goes to the next step
  onClose(): void  // user quit the wizard
  processing?: boolean  // something is running, avoid going forward or backward
}
