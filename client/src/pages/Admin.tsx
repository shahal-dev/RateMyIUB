import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, RefreshCw, Users, Database, Eye, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { useAuth } from '@clerk/clerk-react';
import { toast } from "sonner";

interface FacultyMember {
  name: string;
  title?: string;
  department?: string;
  school?: string;
  email?: string;
  phone?: string;
  office?: string;
  bio?: string;
  imageUrl?: string;
  profileUrl?: string;
}

interface SyncStats {
  total: number;
  created: number;
  updated: number;
  errors: number;
  errorDetails: string[];
}

const Admin = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<FacultyMember[]>([]);
  const [syncResult, setSyncResult] = useState<{ stats: SyncStats; message: string } | null>(null);

  const handlePreviewFaculty = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/faculty/preview');
      const data = await response.json();
      
      if (response.ok) {
        setPreviewData(data.data);
        toast.success(`Found ${data.count} faculty members`);
      } else {
        throw new Error(data.error || 'Failed to preview faculty data');
      }
    } catch (error) {
      console.error('Error previewing faculty:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to preview faculty data');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncFaculty = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch('/api/faculty/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSyncResult(data);
        toast.success(`Sync completed: ${data.stats.created} created, ${data.stats.updated} updated`);
      } else {
        throw new Error(data.error || 'Failed to sync faculty data');
      }
    } catch (error) {
      console.error('Error syncing faculty:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to sync faculty data');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSync = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch('/api/faculty/auto-sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(`Auto-sync completed: ${data.newFacultyAdded} new faculty added`);
      } else {
        throw new Error(data.error || 'Failed to auto-sync faculty data');
      }
    } catch (error) {
      console.error('Error auto-syncing faculty:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to auto-sync faculty data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage faculty data and system operations</p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <Database className="h-3 w-3 mr-1" />
          Administrator
        </Badge>
      </div>

      <Tabs defaultValue="faculty" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="faculty">Faculty Management</TabsTrigger>
          <TabsTrigger value="system">System Status</TabsTrigger>
        </TabsList>

        <TabsContent value="faculty" className="space-y-6">
          {/* Faculty Sync Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Faculty Data Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={handlePreviewFaculty}
                  disabled={loading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  {loading ? 'Loading...' : 'Preview Faculty'}
                </Button>
                
                <Button
                  onClick={handleSyncFaculty}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {loading ? 'Syncing...' : 'Sync Faculty'}
                </Button>
                
                <Button
                  onClick={handleAutoSync}
                  disabled={loading}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  {loading ? 'Auto-syncing...' : 'Auto Sync'}
                </Button>
              </div>

              <div className="mt-4 text-sm text-muted-foreground space-y-1">
                <p><strong>Preview:</strong> See faculty data from IUB website without saving</p>
                <p><strong>Sync:</strong> Import all faculty data and update existing records</p>
                <p><strong>Auto Sync:</strong> Add only new faculty members (recommended for regular updates)</p>
              </div>
            </CardContent>
          </Card>

          {/* Sync Results */}
          {syncResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Sync Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{syncResult.stats.total}</div>
                    <div className="text-sm text-muted-foreground">Total Found</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{syncResult.stats.created}</div>
                    <div className="text-sm text-muted-foreground">Created</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{syncResult.stats.updated}</div>
                    <div className="text-sm text-muted-foreground">Updated</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{syncResult.stats.errors}</div>
                    <div className="text-sm text-muted-foreground">Errors</div>
                  </div>
                </div>

                {syncResult.stats.errorDetails.length > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-medium mb-2">Errors encountered:</div>
                      <ul className="text-sm space-y-1">
                        {syncResult.stats.errorDetails.map((error, index) => (
                          <li key={index} className="text-red-600">• {error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Preview Data */}
          {previewData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Faculty Preview ({previewData.length} found)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 max-h-96 overflow-y-auto">
                  {previewData.slice(0, 10).map((faculty, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{faculty.name}</h3>
                          {faculty.title && <p className="text-sm text-muted-foreground">{faculty.title}</p>}
                          {faculty.department && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {faculty.department}
                            </Badge>
                          )}
                        </div>
                        {faculty.imageUrl && (
                          <img 
                            src={faculty.imageUrl} 
                            alt={faculty.name}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                      {faculty.bio && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {faculty.bio}
                        </p>
                      )}
                    </div>
                  ))}
                  {previewData.length > 10 && (
                    <div className="text-center text-muted-foreground text-sm">
                      ... and {previewData.length - 10} more faculty members
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">System monitoring and status information will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;

