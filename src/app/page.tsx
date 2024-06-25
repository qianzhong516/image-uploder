import Button from '@/components/button';
import DeleteBin from '@/components/icons/delete-bin';

export default function Home() {
  return (
    <div>
      <Button theme='primary' >Submit</Button>
      <Button theme='tertiary' prefixIcon={<DeleteBin size='sm' />}>Submit</Button>
      <Button theme='tertiary' ><DeleteBin size='sm' /></Button>
    </div>
  );
}
