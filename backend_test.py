import requests
import sys
from datetime import datetime

class APITester:
    def __init__(self, base_url="https://design-evolution-56.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.lead_id = None
        self.pipeline_id = None
        self.content_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, check_response=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                # Additional response checks if provided
                if check_response:
                    try:
                        response_data = response.json()
                        if not check_response(response_data):
                            success = False
                            print(f"❌ Failed - Response validation failed")
                            self.failed_tests.append({"test": name, "reason": "Response validation failed"})
                        else:
                            self.tests_passed += 1
                            print(f"✅ Passed - Status: {response.status_code}")
                    except Exception as e:
                        success = False
                        print(f"❌ Failed - Response check error: {str(e)}")
                        self.failed_tests.append({"test": name, "reason": f"Response check error: {str(e)}"})
                else:
                    self.tests_passed += 1
                    print(f"✅ Passed - Status: {response.status_code}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"   Response: {response.text[:200]}")
                except:
                    pass
                self.failed_tests.append({"test": name, "reason": f"Expected {expected_status}, got {response.status_code}"})

            return success, response.json() if response.status_code < 400 else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({"test": name, "reason": str(e)})
            return False, {}

    def test_health(self):
        """Test API health endpoint"""
        success, response = self.run_test(
            "API Health Check",
            "GET",
            "",
            200,
            check_response=lambda r: r.get("status") == "ok"
        )
        return success

    def test_leads_crud(self):
        """Test full CRUD for leads"""
        # List leads (empty initially)
        success, response = self.run_test(
            "List Leads (GET /api/leads)",
            "GET",
            "leads",
            200,
            check_response=lambda r: isinstance(r, list)
        )
        
        # Create lead
        test_lead = {
            "name": f"Test Lead {datetime.now().strftime('%H%M%S')}",
            "email": f"test{datetime.now().strftime('%H%M%S')}@example.com",
            "company": "Test Company",
            "phone": "555-1234",
            "source": "Website",
            "status": "new",
            "value": 5000,
            "notes": "Test notes"
        }
        success, response = self.run_test(
            "Create Lead (POST /api/leads)",
            "POST",
            "leads",
            200,
            data=test_lead,
            check_response=lambda r: r.get("id") and r.get("name") == test_lead["name"]
        )
        if success:
            self.lead_id = response.get("id")
        
        # Update lead
        if self.lead_id:
            update_data = {"status": "contacted", "value": 7500}
            success, response = self.run_test(
                "Update Lead (PATCH /api/leads/{id})",
                "PATCH",
                f"leads/{self.lead_id}",
                200,
                data=update_data,
                check_response=lambda r: r.get("status") == "contacted" and r.get("value") == 7500
            )
        
        # Delete lead
        if self.lead_id:
            success, response = self.run_test(
                "Delete Lead (DELETE /api/leads/{id})",
                "DELETE",
                f"leads/{self.lead_id}",
                200,
                check_response=lambda r: r.get("deleted") == True
            )

    def test_pipeline_crud(self):
        """Test full CRUD for pipeline"""
        # List pipeline
        success, response = self.run_test(
            "List Pipeline (GET /api/pipeline)",
            "GET",
            "pipeline",
            200,
            check_response=lambda r: isinstance(r, list)
        )
        
        # Create pipeline item
        test_pipeline = {
            "title": f"Test Deal {datetime.now().strftime('%H%M%S')}",
            "client": "Test Client",
            "value": 10000,
            "stage": "discovery",
            "owner": "Test Owner",
            "due_date": "2025-12-31",
            "notes": "Test pipeline notes"
        }
        success, response = self.run_test(
            "Create Pipeline Item (POST /api/pipeline)",
            "POST",
            "pipeline",
            200,
            data=test_pipeline,
            check_response=lambda r: r.get("id") and r.get("title") == test_pipeline["title"]
        )
        if success:
            self.pipeline_id = response.get("id")
        
        # Update pipeline (especially stage change)
        if self.pipeline_id:
            update_data = {"stage": "proposal", "value": 15000}
            success, response = self.run_test(
                "Update Pipeline Stage (PATCH /api/pipeline/{id})",
                "PATCH",
                f"pipeline/{self.pipeline_id}",
                200,
                data=update_data,
                check_response=lambda r: r.get("stage") == "proposal" and r.get("value") == 15000
            )
        
        # Delete pipeline item
        if self.pipeline_id:
            success, response = self.run_test(
                "Delete Pipeline Item (DELETE /api/pipeline/{id})",
                "DELETE",
                f"pipeline/{self.pipeline_id}",
                200,
                check_response=lambda r: r.get("deleted") == True
            )

    def test_content_crud(self):
        """Test full CRUD for content calendar"""
        # List content
        success, response = self.run_test(
            "List Content (GET /api/content)",
            "GET",
            "content",
            200,
            check_response=lambda r: isinstance(r, list)
        )
        
        # Create content event
        test_content = {
            "title": f"Test Event {datetime.now().strftime('%H%M%S')}",
            "platform": "Instagram",
            "date": "2025-08-15",
            "status": "draft",
            "notes": "Test content notes"
        }
        success, response = self.run_test(
            "Create Content Event (POST /api/content)",
            "POST",
            "content",
            200,
            data=test_content,
            check_response=lambda r: r.get("id") and r.get("title") == test_content["title"]
        )
        if success:
            self.content_id = response.get("id")
        
        # Update content
        if self.content_id:
            update_data = {"status": "scheduled", "platform": "LinkedIn"}
            success, response = self.run_test(
                "Update Content Event (PATCH /api/content/{id})",
                "PATCH",
                f"content/{self.content_id}",
                200,
                data=update_data,
                check_response=lambda r: r.get("status") == "scheduled" and r.get("platform") == "LinkedIn"
            )
        
        # Delete content
        if self.content_id:
            success, response = self.run_test(
                "Delete Content Event (DELETE /api/content/{id})",
                "DELETE",
                f"content/{self.content_id}",
                200,
                check_response=lambda r: r.get("deleted") == True
            )

    def test_contact_and_auto_lead(self):
        """Test contact form submission and auto-lead creation"""
        # Get initial lead count
        success, initial_leads = self.run_test(
            "Get Initial Lead Count",
            "GET",
            "leads",
            200
        )
        initial_count = len(initial_leads) if success else 0
        
        # Submit contact form
        test_contact = {
            "name": f"Contact Test {datetime.now().strftime('%H%M%S')}",
            "email": f"contact{datetime.now().strftime('%H%M%S')}@example.com",
            "company": "Contact Company",
            "message": "This is a test contact message"
        }
        success, response = self.run_test(
            "Submit Contact Form (POST /api/contact)",
            "POST",
            "contact",
            200,
            data=test_contact,
            check_response=lambda r: r.get("id") and r.get("name") == test_contact["name"]
        )
        
        # Verify auto-created lead
        if success:
            success, new_leads = self.run_test(
                "Verify Auto-Created Lead",
                "GET",
                "leads",
                200,
                check_response=lambda r: len(r) == initial_count + 1
            )
            if success and new_leads:
                # Find the auto-created lead
                auto_lead = next((l for l in new_leads if l.get("email") == test_contact["email"]), None)
                if auto_lead:
                    print(f"   ✓ Auto-created lead found with source: {auto_lead.get('source')}")
                    if auto_lead.get("source") != "Landing Contact":
                        print(f"   ⚠ Warning: Expected source 'Landing Contact', got '{auto_lead.get('source')}'")
                else:
                    print(f"   ❌ Auto-created lead not found")

    def test_stats(self):
        """Test stats endpoint"""
        success, response = self.run_test(
            "Get Stats (GET /api/stats)",
            "GET",
            "stats",
            200,
            check_response=lambda r: (
                "total_leads" in r and
                "new_leads" in r and
                "won_leads" in r and
                "pipeline_count" in r and
                "content_count" in r and
                "pipeline_value_total" in r and
                "pipeline_value_by_stage" in r and
                isinstance(r.get("pipeline_value_by_stage"), dict)
            )
        )
        if success:
            print(f"   Stats: {response.get('total_leads')} leads, {response.get('pipeline_count')} pipeline items, {response.get('content_count')} content events")
            print(f"   Pipeline value by stage: {response.get('pipeline_value_by_stage')}")

def main():
    print("=" * 60)
    print("🚀 Game of Growth API Testing")
    print("=" * 60)
    
    tester = APITester()
    
    # Run all tests
    print("\n📋 Running Backend API Tests...\n")
    
    tester.test_health()
    tester.test_leads_crud()
    tester.test_pipeline_crud()
    tester.test_content_crud()
    tester.test_contact_and_auto_lead()
    tester.test_stats()
    
    # Print summary
    print("\n" + "=" * 60)
    print(f"📊 Test Summary")
    print("=" * 60)
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed / tester.tests_run * 100):.1f}%")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for fail in tester.failed_tests:
            print(f"  - {fail['test']}: {fail['reason']}")
    
    print("=" * 60)
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
