import { Button } from '@/registry/default/ui/button';
import { ButtonGroup } from '@/registry/default/ui/button-group';

export default function ButtonGroupDemo() {
  return (
    <ButtonGroup orientation="horizontal">
      <Button variant="outline" size="md">
        Left
      </Button>
      <Button variant="outline" size="md">
        Center
      </Button>
      <Button variant="outline" size="md">
        Right
      </Button>
    </ButtonGroup>
  );
}
