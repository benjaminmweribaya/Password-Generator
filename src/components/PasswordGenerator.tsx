import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import SecurityProgressBar from '@/components/SecurityProgressBar';
import ThemeToggle from '@/components/ThemeToggle';
import { 
  Copy, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Shield, 
  Save, 
  Download,
  Trash2,
  Settings
} from 'lucide-react';

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
}

interface SavedPassword {
  id: string;
  password: string;
  createdAt: Date;
}

const PasswordGenerator = () => {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
  });

  const [generatedPasswords, setGeneratedPasswords] = useState<string[]>(['']);
  const [batchCount, setBatchCount] = useState(1);
  const [showPasswords, setShowPasswords] = useState(false);
  const [savedPasswords, setSavedPasswords] = useState<SavedPassword[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    const saved = localStorage.getItem('savedPasswords');
    if (saved) {
      setSavedPasswords(JSON.parse(saved));
    }
    generatePasswords();
  }, []);

  const getCharacterSet = useCallback(() => {
    let charset = '';
    
    if (options.includeLowercase) {
      charset += options.excludeSimilar ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
    }
    if (options.includeUppercase) {
      charset += options.excludeSimilar ? 'ABCDEFGHJKMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (options.includeNumbers) {
      charset += options.excludeSimilar ? '23456789' : '0123456789';
    }
    if (options.includeSymbols) {
      charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    }
    
    return charset;
  }, [options]);

  const calculateStrength = useCallback((password: string): { score: number; label: string; color: string } => {
    let score = 0;
    
    // Length scoring
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // Character variety scoring
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['security-weak', 'security-weak', 'security-fair', 'security-good', 'security-strong', 'security-very-strong'];
    
    const index = Math.min(score, 5);
    return {
      score: (score / 7) * 100,
      label: labels[index],
      color: colors[index]
    };
  }, []);

  const generateSinglePassword = useCallback(() => {
    const charset = getCharacterSet();
    if (!charset) return '';
    
    let password = '';
    for (let i = 0; i < options.length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }, [options, getCharacterSet]);

  const generatePasswords = useCallback(() => {
    const newPasswords = Array(batchCount).fill(null).map(() => generateSinglePassword());
    setGeneratedPasswords(newPasswords);
  }, [batchCount, generateSinglePassword]);

  const copyToClipboard = async (password: string, index?: number) => {
    try {
      await navigator.clipboard.writeText(password);
      toast({
        title: "Copied!",
        description: `Password ${index !== undefined ? `#${index + 1} ` : ''}copied to clipboard`,
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const copyAllPasswords = async () => {
    const allPasswords = generatedPasswords.join('\n');
    await copyToClipboard(allPasswords);
  };

  const savePassword = (password: string) => {
    const newSavedPassword: SavedPassword = {
      id: Date.now().toString(),
      password,
      createdAt: new Date(),
    };
    
    const updated = [...savedPasswords, newSavedPassword];
    setSavedPasswords(updated);
    localStorage.setItem('savedPasswords', JSON.stringify(updated));
    
    toast({
      title: "Password saved",
      description: "Password saved to local storage",
    });
  };

  const deleteSavedPassword = (id: string) => {
    const updated = savedPasswords.filter(p => p.id !== id);
    setSavedPasswords(updated);
    localStorage.setItem('savedPasswords', JSON.stringify(updated));
  };

  const strength = calculateStrength(generatedPasswords[0] || '');

  return (
    <div className="space-y-6">
      {/* Main Generator Card */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-primary mr-2" />
              <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
                Fortify Password Generator
              </CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" className="w-9 px-0">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription className="text-muted-foreground">
            Generate secure, customizable passwords with advanced options
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Password Length */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="length" className="text-sm font-medium">Password Length</Label>
              <span className="text-sm font-mono bg-secondary px-2 py-1 rounded">{options.length}</span>
            </div>
            <Slider
              id="length"
              min={6}
              max={64}
              step={1}
              value={[options.length]}
              onValueChange={(value) => setOptions(prev => ({ ...prev, length: value[0] }))}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Character Options */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="uppercase"
                  checked={options.includeUppercase}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, includeUppercase: !!checked }))
                  }
                />
                <Label htmlFor="uppercase" className="text-sm">Uppercase (A-Z)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lowercase"
                  checked={options.includeLowercase}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, includeLowercase: !!checked }))
                  }
                />
                <Label htmlFor="lowercase" className="text-sm">Lowercase (a-z)</Label>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="numbers"
                  checked={options.includeNumbers}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, includeNumbers: !!checked }))
                  }
                />
                <Label htmlFor="numbers" className="text-sm">Numbers (0-9)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="symbols"
                  checked={options.includeSymbols}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, includeSymbols: !!checked }))
                  }
                />
                <Label htmlFor="symbols" className="text-sm">Symbols (!@#$)</Label>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="excludeSimilar"
              checked={options.excludeSimilar}
              onCheckedChange={(checked) => 
                setOptions(prev => ({ ...prev, excludeSimilar: !!checked }))
              }
            />
            <Label htmlFor="excludeSimilar" className="text-sm">
              Exclude similar characters (I, l, 1, O, 0)
            </Label>
          </div>

          <Separator />

          {/* Batch Generation */}
          <div className="space-y-3">
            <Label htmlFor="batch" className="text-sm font-medium">Generate Multiple Passwords</Label>
            <div className="flex items-center space-x-4">
              <Input
                id="batch"
                type="number"
                min={1}
                max={20}
                value={batchCount}
                onChange={(e) => setBatchCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                className="w-20"
              />
              <Button onClick={generatePasswords} className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Generate</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Passwords */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Generated Passwords</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPasswords(!showPasswords)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            {batchCount > 1 && (
              <Button variant="outline" size="sm" onClick={copyAllPasswords}>
                <Download className="w-4 h-4 mr-2" />
                Copy All
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {generatedPasswords.map((password, index) => {
            const passwordStrength = calculateStrength(password);
            return (
              <div key={index} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Input
                    value={password}
                    type={showPasswords ? 'text' : 'password'}
                    readOnly
                    className="font-mono flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(password, index)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => savePassword(password)}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Strength Indicator */}
                <SecurityProgressBar 
                  score={passwordStrength.score}
                  label={passwordStrength.label}
                />
                
                {index < generatedPasswords.length - 1 && <Separator />}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Saved Passwords */}
      {savedPasswords.length > 0 && (
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Saved Passwords</CardTitle>
            <CardDescription>Previously generated passwords stored locally</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {savedPasswords.map((saved) => (
                <div key={saved.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex-1 min-w-0">
                    <Input
                      value={saved.password}
                      type={showPasswords ? 'text' : 'password'}
                      readOnly
                      className="font-mono text-sm bg-transparent border-none p-0 focus-visible:ring-0"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {saved.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(saved.password)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSavedPassword(saved.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PasswordGenerator;