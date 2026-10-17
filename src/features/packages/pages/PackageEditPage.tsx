import { useParams } from 'react-router-dom';

import { LoadingState } from '@/components/feedback/LoadingState';
import { PackageForm } from '../components/PackageForm';
import { usePackage } from '../hooks/usePackages';

export function PackageEditPage() {
  const { packageId } = useParams<{ packageId: string }>();
  const packageQuery = usePackage(packageId);

  if (packageQuery.isPending) {
    return <LoadingState />;
  }

  if (packageQuery.isError || !packageQuery.data) {
    return (
      <p className="text-danger">
        {packageQuery.isError ? 'Unable to load package.' : 'Package not found.'}
      </p>
    );
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <PackageForm
        key={packageQuery.data.id}
        mode="edit"
        package={packageQuery.data}
      />
    </section>
  );
}
